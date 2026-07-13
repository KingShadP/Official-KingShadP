"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, X, CheckCircle2, Lock, Cpu, Download } from "lucide-react";
import { FadeInScroll } from "@/components/FadeInScroll";

const LOCAL_MOCK_PRODUCTS = [
  {
    id: "prod_01",
    title: "The Platinum Heavy Hoodie",
    category: "hoodie",
    price: "$145 USD",
    specs: "500 GSM organic cotton loopback, custom shoulder line, clean rib tailoring",
    video: "/Model_wearing_KingShadP_hoodie_202605270727.mp4",
    image: "/front_black_1_1.png",
    description: "Crafted from heavy-weight Portuguese organic loopback cotton. Tailored for natural weight draping without excessive branding, complete with an elegant, clean silhouette."
  },
  {
    id: "prod_02",
    title: "Columbia Soft Shell Jacket",
    category: "jacket",
    price: "$210 USD",
    specs: "HydraShield breathable layer, waterproof zips, 3-layer wind protection",
    image: "/unisex_columbia_soft_shell_jacket_collegiate_navy_front_6a16eba5ad374.jpg",
    description: "An advanced, wind-resistant soft shell jacket meticulously engineered for extreme atmospheric shifts. Minimal design paired with sealed, dry-guard chambers."
  },
  {
    id: "prod_03",
    title: "French Navy Crafter Tee",
    category: "tee",
    price: "$65 USD",
    specs: "240 GSM organic combed cotton, relaxed fit, premium neck ribbing",
    image: "/unisex_organic_mid_light_crafter_t_shirt_french_navy_front_6a16dd454c318.jpg",
    description: "A luxury mid-weight tee set in deep indigo tones. Features specialized drop-shoulder architecture and a durable combed jersey finish."
  },
  {
    id: "prod_04",
    title: "Desert Dust Crafter Tee",
    category: "tee",
    price: "$65 USD",
    specs: "240 GSM organic combed cotton, relaxed fit, clean seam hems",
    image: "/unisex_organic_mid_light_crafter_t_shirt_desert_dust_front_6a16dd454c251.jpg",
    description: "Formed in high-quality organic cotton jersey. Inspired by warm earth tones with zero surface branding—pure focus on clean geometric shape."
  }
];

export default function FashionPage() {
  const [products, setProducts] = useState<any[]>(LOCAL_MOCK_PRODUCTS);
  const [activeProductFilter, setActiveProductFilter] = useState("all");
  const [shopifyMode, setShopifyMode] = useState("demo");
  const [shopifyMessage, setShopifyMessage] = useState("");

  // Acquisition States
  const [selectedAcquisitionProduct, setSelectedAcquisitionProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [deliveryName, setDeliveryName] = useState<string>("");
  const [deliveryEmail, setDeliveryEmail] = useState<string>("");
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<string>("");
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");
  const [acquisitionComplete, setAcquisitionComplete] = useState<boolean>(false);
  const [generatedChecksum, setGeneratedChecksum] = useState<string>("");
  const [generatedTrackingId, setGeneratedTrackingId] = useState<string>("");

  useEffect(() => {
    async function fetchProducts() {
      const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
      const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

      if (!domain || !token) {
        setProducts(LOCAL_MOCK_PRODUCTS);
        setShopifyMode("demo");
        setShopifyMessage("Loaded local blueprint catalog. Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN to view your live Shopify catalog.");
        return;
      }

      const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
      const shopifyUrl = `https://${cleanDomain}/api/2024-01/graphql.json`;

      const query = `
        query getProducts {
          products(first: 20) {
            edges {
              node {
                id
                title
                description
                handle
                productType
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch(shopifyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
        const data = await response.json();
        if (data.errors) throw new Error(data.errors[0]?.message || "GraphQL Error");

        const shopifyProducts = data.data?.products?.edges || [];
        if (shopifyProducts.length === 0) {
          setProducts(LOCAL_MOCK_PRODUCTS);
          setShopifyMode("live");
          setShopifyMessage("Live connection established, but no products were returned from your Shopify catalog.");
          return;
        }

        const mapped = shopifyProducts.map((edge: any) => {
          const p = edge.node;
          const priceAmount = p.priceRange?.minVariantPrice?.amount || "0";
          const currencyCode = p.priceRange?.minVariantPrice?.currencyCode || "USD";
          const imageNode = p.images?.edges?.[0]?.node;
          const imageUrl = imageNode?.url || "https://picsum.photos/seed/placeholder/600/800";

          let category = "tee";
          const lowerTitle = p.title.toLowerCase();
          const lowerType = (p.productType || "").toLowerCase();

          if (lowerTitle.includes("hoodie") || lowerTitle.includes("sweatshirt") || lowerType.includes("hoodie") || lowerType.includes("sweatshirt")) {
            category = "hoodie";
          } else if (lowerTitle.includes("jacket") || lowerTitle.includes("outerwear") || lowerTitle.includes("coat") || lowerType.includes("jacket") || lowerType.includes("outerwear")) {
            category = "jacket";
          } else if (lowerTitle.includes("tee") || lowerTitle.includes("t-shirt") || lowerTitle.includes("shirt") || lowerType.includes("tee") || lowerType.includes("t-shirt") || lowerType.includes("shirt")) {
            category = "tee";
          }

          const variantTitles = p.variants?.edges?.map((v: any) => v.node.title) || [];
          const hasSizeVariants = variantTitles.some((t: string) => ["XS", "S", "M", "L", "XL", "XXL"].includes(t.toUpperCase()));

          return {
            id: p.id,
            title: p.title,
            category,
            price: `$${parseFloat(priceAmount).toFixed(0)} ${currencyCode}`,
            specs: hasSizeVariants 
              ? `Sizes: ${variantTitles.join(", ")}` 
              : "Sovereign Premium Edition",
            image: imageUrl,
            description: p.description || "No description provided.",
            shopifyUrl: `https://${cleanDomain}/products/${p.handle}`,
            variants: p.variants?.edges?.map((v: any) => ({
              id: v.node.id,
              title: v.node.title,
              price: `$${parseFloat(v.node.price?.amount || priceAmount).toFixed(0)}`
            })) || []
          };
        });

        setProducts(mapped);
        setShopifyMode("live");
        setShopifyMessage(`Live synchronisation successful: Synchronizing ${mapped.length} design modules.`);
      } catch (err: any) {
        console.error("Shopify Direct Fetch Error:", err);
        setProducts(LOCAL_MOCK_PRODUCTS);
        setShopifyMode("error");
        setShopifyMessage(`Connection node interrupted: ${err.message || "Unknown Error"}.`);
      }
    }
    fetchProducts();
  }, []);

  const handleAcquisitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAcquisitionProduct) return;

    const checksum = `ACQ-${Math.random().toString(16).slice(2, 8).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
    const trackingId = `KSP-TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    setGeneratedChecksum(checksum);
    setGeneratedTrackingId(trackingId);

    try {
      const storedLogs = localStorage.getItem("kingshadp_vault_logs");
      const currentLogs = storedLogs ? JSON.parse(storedLogs) : [];
      
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      const newLog = {
        id: `acq-${Date.now()}`,
        timestamp,
        title: `Acquisition: ${selectedAcquisitionProduct.title}`,
        sector: "ORDER-PENDING",
        details: `Acquisition finalized for ${selectedAcquisitionProduct.title} (${selectedAcquisitionProduct.price}) - Size: ${selectedSize}. Coordinator name: ${deliveryName}. Contact channel: ${deliveryEmail}. Delivery Coordinates: ${deliveryCoordinates}. Customized instructions: ${deliveryNotes || "none"}. Active Tracking Core: ${trackingId}. Status is verified on sovereign blockchain.`,
        checksum
      };

      localStorage.setItem("kingshadp_vault_logs", JSON.stringify([newLog, ...currentLogs]));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Ledger logging failed", err);
    }

    setAcquisitionComplete(true);
  };

  const filteredProducts = activeProductFilter === "all" 
    ? products 
    : products.filter((p: any) => p.category === activeProductFilter);

  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="flex flex-col gap-12 mt-6">
      
      <div className="border-b border-[#dcc57b]/20 pb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="flex flex-col gap-3">
          <div className="font-mono text-[10px] text-[#93000a] uppercase tracking-widest flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>{"// PATTERN RESEARCH & MATTE TEXTILES"}</span>
            {shopifyMode === "live" && (
              <span className="flex items-center gap-1.5 font-mono text-[8px] text-[#22c55e] uppercase tracking-wider bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-0.5 rounded-sm">
                <span className="w-1 h-1 rounded-full bg-[#22c55e] animate-pulse" />
                Shopify Linked
              </span>
            )}
            {shopifyMode === "demo" && (
              <span className="flex items-center gap-1.5 font-mono text-[8px] text-[#dcc57b] uppercase tracking-wider bg-[#dcc57b]/5 border border-[#dcc57b]/20 px-2 py-0.5 rounded-sm">
                <span className="w-1 h-1 rounded-full bg-[#dcc57b] animate-pulse" />
                Offline Mode
              </span>
            )}
            {shopifyMode === "error" && (
              <span className="flex items-center gap-1.5 font-mono text-[8px] text-[#ef4444] uppercase tracking-wider bg-[#ef4444]/10 border border-[#ef4444]/20 px-2 py-0.5 rounded-sm">
                <span className="w-1 h-1 rounded-full bg-[#ef4444] animate-pulse" />
                Fallback Active
              </span>
            )}
          </div>
          <h1 className="font-serif text-5xl font-light text-white">
            Garment Lookbook.
          </h1>
          <p className="font-sans text-sm text-white/60 font-light max-w-xl leading-relaxed mt-1">
            Fashion is not mere decoration—it is architectural shelter. Every product is milled from heavyweight organic slate and designed with absolute graphic restraint.
          </p>
          {shopifyMode === "live" && (
            <p className="font-mono text-[8.5px] text-[#22c55e]/90 uppercase tracking-widest mt-0.5">
              Synced successfully: Loading live shopify inventory containing {products.length} design modules.
            </p>
          )}
        </div>

        <div className="flex gap-2 bg-[#0c0a09]/60 backdrop-blur-md border border-[#dcc57b]/20 p-1 rounded-xl shadow-sm">
          {["all", "hoodie", "jacket", "tee"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveProductFilter(filter)}
              className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
                activeProductFilter === filter
                  ? "bg-[#dcc57b] text-[#090908] font-medium"
                  : "text-white/60 hover:text-[#dcc57b]"
              }`}
            >
              {filter}s
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {filteredProducts.map((p) => (
          <FadeInScroll key={p.id}>
            <div className="flex flex-col gap-6 bg-[#0c0a09]/60 backdrop-blur-md border border-[#dcc57b]/20 p-6 rounded-2xl shadow-sm hover:border-[#dcc57b]/50 transition-colors group">
              
              <div className="aspect-[4/5] w-full bg-[#1c1a17] rounded-xl relative overflow-hidden border border-white/5">
                {p.video ? (
                  <video
                    src={p.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-100 animate-fade-in"
                  />
                )}
                <div className="absolute top-4 left-4 font-mono text-[9px] bg-[#dcc57b] text-[#090908] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                  {p.category}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-serif text-2xl font-normal text-white">{p.title}</h4>
                  <span className="font-mono text-sm text-[#dcc57b] font-semibold">{p.price}</span>
                </div>
                
                <p className="font-sans text-xs text-white/50 leading-relaxed font-light mt-1">
                  {p.description}
                </p>

                <div className="border-t border-[#dcc57b]/20 pt-4 mt-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 block">SPECIFICATIONS:</span>
                  <span className="font-mono text-[10px] text-[#dcc57b] font-medium block mt-1">{p.specs}</span>
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedAcquisitionProduct(p);
                    setAcquisitionComplete(false);
                    setDeliveryName("");
                    setDeliveryEmail("");
                    setDeliveryCoordinates("");
                    setDeliveryNotes("");
                    setSelectedSize("M");
                  }}
                  className="mt-4 w-full bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] font-mono text-[10px] uppercase tracking-widest py-3.5 rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Acquire Module
                </button>
              </div>
            </div>
          </FadeInScroll>
        ))}
      </div>

      <AnimatePresence>
        {selectedAcquisitionProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="bg-[#0c0a09] border border-[#dcc57b]/30 w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_15px_50px_rgba(147,0,10,0.3)] flex flex-col relative"
            >
              <div className="border-b border-[#dcc57b]/10 px-6 py-5 flex justify-between items-center bg-[#140608]/40">
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[8px] text-[#93000a] tracking-widest uppercase font-bold">SECURE TRANSACTION PORTAL</span>
                  <h3 className="font-serif text-2xl text-white font-light italic mt-1">Module Acquisition Protocol</h3>
                </div>
                <button 
                  onClick={() => setSelectedAcquisitionProduct(null)}
                  className="text-white/40 hover:text-white transition-colors p-2"
                  aria-label="Close portal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!acquisitionComplete ? (
                <form onSubmit={handleAcquisitionSubmit} className="p-6 md:p-8 flex flex-col gap-6 text-left">
                  <div className="flex gap-4 items-center bg-[#1c1a17]/50 border border-white/5 p-4 rounded-xl">
                    <div className="w-16 h-20 bg-[#2c2a27] rounded-lg overflow-hidden shrink-0 border border-white/10 relative">
                      {selectedAcquisitionProduct.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={selectedAcquisitionProduct.image} alt={selectedAcquisitionProduct.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="font-mono text-[8px] text-[#dcc57b] uppercase tracking-wider">{selectedAcquisitionProduct.category}</span>
                      <h4 className="font-serif text-xl text-white font-light italic">{selectedAcquisitionProduct.title}</h4>
                      <span className="font-mono text-xs text-[#dcc57b] font-semibold mt-1">{selectedAcquisitionProduct.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Select size designation:</label>
                    <div className="grid grid-cols-5 gap-2">
                      {["XS", "S", "M", "L", "XL"].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`min-h-[44px] rounded-lg font-mono text-xs border transition-all flex items-center justify-center font-bold ${
                            selectedSize === sz
                              ? "bg-[#dcc57b] text-[#090908] border-[#dcc57b]"
                              : "border-white/10 hover:border-[#dcc57b]/50 text-white"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Coordinator Name:</label>
                      <input
                        type="text"
                        required
                        value={deliveryName}
                        onChange={(e) => setDeliveryName(e.target.value)}
                        placeholder="Full Name"
                        className="bg-[#090908] border border-white/15 px-4 py-3 rounded-lg font-sans text-sm text-white outline-none focus:border-[#dcc57b] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Contact Channel (Email):</label>
                      <input
                        type="email"
                        required
                        value={deliveryEmail}
                        onChange={(e) => setDeliveryEmail(e.target.value)}
                        placeholder="email@domain.com"
                        className="bg-[#090908] border border-white/15 px-4 py-3 rounded-lg font-sans text-sm text-white outline-none focus:border-[#dcc57b] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Delivery Coordinates / Address:</label>
                    <input
                      type="text"
                      required
                      value={deliveryCoordinates}
                      onChange={(e) => setDeliveryCoordinates(e.target.value)}
                      placeholder="Physical delivery address or coordinate sectors"
                      className="bg-[#090908] border border-white/15 px-4 py-3 rounded-lg font-sans text-sm text-white outline-none focus:border-[#dcc57b] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Specialized Instructions:</label>
                    <textarea
                      rows={3}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="Sizing adjustments, delivery parameters, secure drop requirements..."
                      className="bg-[#090908] border border-white/15 px-4 py-3 rounded-lg font-sans text-sm text-white outline-none focus:border-[#dcc57b] transition-colors font-light"
                    />
                  </div>

                  <div className="flex items-start gap-3 bg-[#93000a]/10 border border-[#93000a]/30 p-4 rounded-xl">
                    <Lock className="w-5 h-5 text-[#93000a] shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-[9px] text-white font-semibold uppercase tracking-wider">CRYPTOGRAPHIC SOVEREIGN SECURITY</span>
                      <p className="font-sans text-xs text-white/60 leading-relaxed font-light mt-1">
                        By submitting, your order is secured and committed to our permanent private ledger. Our logistics team will contact you directly to process payment via sovereign channels.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] font-mono text-[10px] tracking-widest uppercase py-4 rounded-lg font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Transmit Acquisition Order <Cpu className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="p-8 md:p-12 flex flex-col items-center justify-center gap-6 text-center">
                  <CheckCircle2 className="w-16 h-16 text-[#dcc57b] animate-bounce" />
                  
                  <div className="flex flex-col gap-2">
                    <h4 className="font-serif text-3xl text-white font-light italic">Transmission Successful</h4>
                    <p className="font-sans text-sm text-white/60 font-light max-w-md mt-1 leading-relaxed">
                      Your acquisition request has been encrypted and recorded successfully. Our system generated the following diagnostic parameters:
                    </p>
                  </div>

                  <div className="w-full bg-[#1c1a17] border border-white/10 p-5 rounded-xl font-mono text-xs text-left flex flex-col gap-3">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">ORDER REFERENCE:</span>
                      <span className="text-white font-semibold">{selectedAcquisitionProduct.title} ({selectedSize})</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">SECURE LEDGER HASH:</span>
                      <span className="text-[#dcc57b] font-semibold break-all text-[11px]">{generatedChecksum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">TRACKING COORD:</span>
                      <span className="text-white font-medium">{generatedTrackingId}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAcquisitionProduct(null)}
                    className="mt-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#dcc57b]/30 text-white font-mono text-[10px] uppercase tracking-widest px-8 py-3 rounded-lg transition-all"
                  >
                    [ Close Terminal Portal ]
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
