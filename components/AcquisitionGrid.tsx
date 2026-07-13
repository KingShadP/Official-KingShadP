"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, FileCode, Film, Shirt, Globe, Rocket, HelpCircle, Send, Check } from "lucide-react";
import { GlitchText } from "./GlitchText";

type AssetIP = {
  id: string;
  name: string;
  code: string;
  category: "MUSIC_CATALOG" | "GARMENT_TECH" | "CINEMA_STORY" | "VISUAL_IP";
  status: "AVAILABLE" | "UNDER_NEGO" | "EXCLUSIVE_HELD";
  description: string;
  valuation: string;
  specs: { k: string; value: string }[];
  details: string;
};

const CREATIVE_SYSTEMS_IP: AssetIP[] = [
  {
    id: "ip_1",
    name: "Sovereign Wave Sound Master IP",
    code: "IP-SW-01",
    category: "MUSIC_CATALOG",
    status: "AVAILABLE",
    description: "Exclusive sync licensing, mechanical rights, and digital release distribution codes of Sovereign Wave Vol. I-IV.",
    valuation: "Orbit Grade Alpha // Fractional",
    specs: [
      { k: "Stems Availability", value: "High Fidelity 24bit WAV" },
      { k: "Composition Royalty", value: "Sovereign Shared Structure" },
      { k: "Metadata Status", value: "Encoded Universal ISRC" }
    ],
    details: "This includes 12 master tracks of custom synth loops and physical soundwave records. Suitable for cinema sync or luxury product line placement."
  },
  {
    id: "ip_2",
    name: "Crowned Standard Pattern Blueprints",
    code: "IP-CS-GARM",
    category: "GARMENT_TECH",
    status: "UNDER_NEGO",
    description: "Production pattern blueprints, fabric specifications, organic dye equations, and coordinate marking system designs.",
    valuation: "Joint Venture Structure",
    specs: [
      { k: "Garment Standard", value: "500gsm Heavy Loopback" },
      { k: "Marking Layout", value: "Decryption Stamp Left Rib" },
      { k: "Manufacturer Status", value: "Matte Slate Organic Mill" }
    ],
    details: "The Crowned Standard is a physical design system that replaces all double crowns with minimalist geometric slashed vector strokes."
  },
  {
    id: "ip_3",
    name: "The Silent Protocol Screenplay",
    code: "IP-SP-CINEMA",
    category: "CINEMA_STORY",
    status: "AVAILABLE",
    description: "Complete cinematic sci-fi trilogy screen drafts, lore directories, character rosters, and virtual architectural asset packs.",
    valuation: "Equity / Co-Production Core",
    specs: [
      { k: "Screenplay Pages", value: "114 Draft V_3" },
      { k: "Virtual Universe Status", value: "Interactive Unreal Engine Maps" },
      { k: "Lore Completeness", value: "98.4% Documented Ledger" }
    ],
    details: "A high-concept psychological sci-fi world framing 'The Creator' // 'The Create' split into a dystopian luxury landscape of Sector 42."
  },
  {
    id: "ip_4",
    name: "Telemetry Matrix Interface Engine",
    code: "IP-TM-VISUAL",
    category: "VISUAL_IP",
    status: "EXCLUSIVE_HELD",
    description: "Visual system source codes including custom canvas particle bursts, CRT overlay variables, and magnetic micro-interactions.",
    valuation: "Licenced Core Node Only",
    specs: [
      { k: "Engine Standard", value: "React TS + Tailwind + motion" },
      { k: "Integrity Checks", value: "Strict Sub-Pixel Rendering" },
      { k: "Telemetry Stream", value: "Active UTM Time Sync" }
    ],
    details: "The exact design language systems used to build KingShadP command centers. Exclusively held, license request subject to orbit check."
  }
];

export function AcquisitionGrid() {
  const [selectedIP, setSelectedIP] = useState<AssetIP | null>(null);
  const [formData, setFormData] = useState({ name: "", agency: "", email: "", proposal: "" });
  const [isSent, setIsSent] = useState(false);

  const handleAcquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setSelectedIP(null);
      setIsSent(false);
      setFormData({ name: "", agency: "", email: "", proposal: "" });
    }, 2800);
  };

  const categoryIcons = {
    MUSIC_CATALOG: <Coins className="w-4 h-4 text-gold" />,
    GARMENT_TECH: <Shirt className="w-4 h-4 text-oxblood" />,
    CINEMA_STORY: <Film className="w-4 h-4 text-ivory/60" />,
    VISUAL_IP: <Globe className="w-4 h-4 text-emerald-500" />
  };

  return (
    <div className="w-full">
      {/* Overview */}
      <div className="mb-12 border-b border-ivory/10 pb-8 text-left">
        <div className="font-mono text-[9px] text-oxblood uppercase tracking-[0.4em] mb-2">{"// INTELLECTUAL PROPERTY REPOSITORY"}</div>
        <h3 className="font-serif text-3xl md:text-4xl text-ivory font-light italic">
          Creative Asset Acquisition & Partnerships
        </h3>
        <p className="font-sans text-xs text-ivory/50 font-light mt-4 max-w-2xl leading-relaxed">
          The central archive registers institutional creative asset codes across Sound, Weave, Cinema, and Interface blueprints. Select a register coordinate below to submit a secure acquisition request or coordinate co-production.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CREATIVE_SYSTEMS_IP.map((ip) => (
          <div
            key={ip.id}
            className="border border-ivory/10 p-6 flex flex-col gap-6 bg-[#070707] relative group rounded hover:border-gold/30 transition-colors select-none text-left"
          >
            <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-10 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-ivory/40">
                {categoryIcons[ip.category]}
                <span>{ip.category.replace("_", " ")}</span>
              </div>
              <span className={`font-mono text-[8px] uppercase px-2 py-0.5 border ${
                ip.status === "AVAILABLE" 
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                  : ip.status === "UNDER_NEGO"
                  ? "border-amber-500/20 bg-amber-500/5 text-amber-500"
                  : "border-oxblood/20 bg-oxblood/5 text-oxblood"
              }`}>
                {ip.status.replace("_", " ")}
              </span>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[9px] text-oxblood font-semibold tracking-widest">{ip.code}</span>
              <h4 className="font-serif text-2xl text-ivory font-light italic group-hover:text-gold transition-all">
                {ip.name}
              </h4>
              <p className="font-sans text-xs text-ivory/50 font-light leading-relaxed">
                {ip.description}
              </p>
            </div>

            {/* Specs */}
            <div className="flex flex-col gap-2 border-t border-b border-ivory/5 py-4 my-2">
              {ip.specs.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center font-mono text-[9px] uppercase">
                  <span className="text-ivory/30">{item.k}:</span>
                  <span className="text-ivory/70">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Bottom valuation & trigger */}
            <div className="flex justify-between items-center mt-auto pt-2">
              <div className="flex flex-col text-left">
                <span className="font-mono text-[8px] text-ivory/30 uppercase tracking-widest">Valuation Index:</span>
                <span className="font-serif text-sm text-gold italic font-light">{ip.valuation}</span>
              </div>

              {ip.status !== "EXCLUSIVE_HELD" ? (
                <button
                  onClick={() => setSelectedIP(ip)}
                  className="bg-ivory/5 hover:bg-oxblood/20 hover:border-oxblood/50 text-ivory font-mono text-[9px] tracking-widest uppercase border border-ivory/10 px-4 py-2 transition-all cursor-pointer pointer-events-auto"
                >
                  ACQUIRE_RIGHTS
                </button>
              ) : (
                <span className="font-mono text-[8.5px] text-oxblood uppercase tracking-widest">EXCLUSIVE HOLD</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Acquisition Overlay Modal Form */}
      <AnimatePresence>
        {selectedIP && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/95 backdrop-blur-md"
          >
            {/* Overlay background closer */}
            <div className="absolute inset-0" onClick={() => setSelectedIP(null)} />

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#090909] border border-oxblood/20 p-8 rounded shadow-2xl z-10 select-none"
            >
              <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-20 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedIP(null)}
                className="absolute top-6 right-6 text-ivory/40 hover:text-gold transition-colors focus:outline-none pointer-events-auto cursor-pointer"
                aria-label="Close form"
              >
                X
              </button>

              {/* Form Content */}
              {!isSent ? (
                <form onSubmit={handleAcquireSubmit} className="flex flex-col gap-6 text-left">
                  <div className="border-b border-ivory/10 pb-4">
                    <span className="font-mono text-[8px] text-oxblood uppercase tracking-[0.3em]">{"// LEASE & ACCESS CODE DIRECTIVE"}</span>
                    <h4 className="font-serif text-2xl text-ivory italic font-light leading-snug">
                      Acquisition Portal: {selectedIP.name}
                    </h4>
                    <p className="font-mono text-[9px] text-gold uppercase mt-1">CODE REFERENCE: {selectedIP.code}</p>
                  </div>

                  <p className="font-sans text-xs text-ivory/60 leading-relaxed font-light">
                    {selectedIP.details}
                  </p>

                  <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">REPRESENTATIVE NAME:</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-void/80 border border-ivory/10 px-4 py-2 text-xs text-ivory font-mono outline-none focus:border-oxblood/50 transition-colors uppercase"
                        placeholder="E.G. JOHN SMITH"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">AGENCY / CORPORATION:</label>
                      <input
                        type="text"
                        required
                        value={formData.agency}
                        onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                        className="bg-void/80 border border-ivory/10 px-4 py-2 text-xs text-ivory font-mono outline-none focus:border-oxblood/50 transition-colors uppercase"
                        placeholder="E.G. METROPOLIS HOLDINGS"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">AUTHORITATIVE EMAIL CHANNEL:</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-void/80 border border-ivory/10 px-4 py-2 text-xs text-ivory font-mono outline-none focus:border-oxblood/50 transition-colors"
                        placeholder="REP@ORGANIZATION.COM"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">PROPOSAL STRATEGY LEDGER:</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.proposal}
                        onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                        className="bg-void/80 border border-ivory/10 px-4 py-2 text-xs text-ivory font-sans font-light outline-none focus:border-oxblood/50 transition-colors"
                        placeholder="Describe the intended placement, distribution network, or investment trajectory."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-oxblood/35 hover:bg-oxblood/70 border border-oxblood/50 hover:border-gold/30 text-ivory font-mono text-[10px] tracking-widest uppercase py-3 transition-all flex items-center justify-center gap-2 pointer-events-auto"
                  >
                    TRANSMIT SECURE INQUIRY <Send className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center text-emerald-400 animate-pulse">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-2xl text-ivory italic font-light">Transmission Relayed</h4>
                  <p className="font-mono text-[10px] text-ivory/40 uppercase tracking-widest max-w-sm leading-relaxed">
                    Security gateway checked OK. Encrypted telemetry relay logged to central orbit ledger. Standby for authoritative contact.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
