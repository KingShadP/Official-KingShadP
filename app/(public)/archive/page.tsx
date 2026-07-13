"use client";

import React from "react";
import { motion } from "framer-motion";
import { AvariceArtifacts } from "@/components/AvariceArtifacts";
import { FadeInScroll } from "@/components/FadeInScroll";
import { Download } from "lucide-react";

export default function ArchivePage() {
  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="flex flex-col gap-12 mt-6">
      <AvariceArtifacts />
      
      <FadeInScroll>
        <div className="border border-[#dcc57b]/30 bg-gradient-to-r from-[#140608] to-[#0c0304] p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto shadow-[0_10px_35px_rgba(147,0,10,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#93000a]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-3 text-left">
            <span className="font-mono text-[9px] text-[#93000a] font-bold tracking-[0.2em] uppercase">{"// THE OFFICIAL SHOPIFY INTEGRATION"}</span>
            <h3 className="font-serif text-3xl md:text-4xl text-white font-light italic">Sovereign Shopify Theme Core</h3>
            <p className="font-sans text-sm text-white/70 max-w-xl leading-relaxed font-light mt-1">
              Deploy the exact aesthetic design footprint of KingShadP onto your own e-commerce storefront. This premium zip template is pre-packaged with our signature Void/Ivory layout, tailored font styles, and responsive lookbooks.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 font-mono text-[9px] text-white/55">
              <span className="border border-white/10 px-2.5 py-1 bg-white/5 rounded-sm">VERSION: 2.1.0</span>
              <span className="border border-white/10 px-2.5 py-1 bg-white/5 rounded-sm">COMPATIBILITY: SHOPIFY OS 2.0</span>
              <span className="border border-white/10 px-2.5 py-1 bg-white/5 rounded-sm">FORMAT: COMPRESSED ZIP</span>
            </div>
          </div>
          
          <a 
            href="/divine-archive-shopify.zip" 
            download="divine-archive-shopify.zip"
            className="w-full md:w-auto bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] font-mono text-[11px] uppercase tracking-widest px-8 py-4 rounded-lg font-bold transition-all hover:scale-[1.03] flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(220,197,123,0.35)] shrink-0"
          >
            <Download className="w-4 h-4" /> Download Theme ZIP
          </a>
        </div>
      </FadeInScroll>
    </motion.div>
  );
}
