import type { Metadata } from "next";
import { ShopExperience } from "@/components/shop/ShopExperience";
import { getShopifyProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop — KingShadP",
  description: "Shop the official KingShadP collection.",
};

export default async function ShopPage() {
  const products = await getShopifyProducts().catch(() => []);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-36 md:pt-44 pb-28">
      <div className="max-w-2xl mb-14">
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-4">Shop</p>
        <h1 className="font-serif font-light text-5xl md:text-7xl text-ivory mb-6">The Collection</h1>
        <p className="font-serif font-light text-lg md:text-xl text-ivory/65 leading-relaxed">
          A direct channel for garments, objects, and future releases from the house.
        </p>
      </div>

      {products.length > 0 ? (
        <ShopExperience products={products} />
      ) : (
        <div className="border border-ivory/10 bg-panel p-8 md:p-10 max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bronze mb-4">Storefront Ready</p>
          <p className="font-serif font-light text-lg md:text-xl text-ivory/70 leading-relaxed">
            Add <span className="text-ivory">SHOPIFY_STORE_DOMAIN</span> and <span className="text-ivory">SHOPIFY_STOREFRONT_ACCESS_TOKEN</span> to load live products from Shopify here.
          </p>
        </div>
      )}
    </section>
  );
}
