"use client";

import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="bg-void py-32 px-6 border-t border-rosegold/10 relative overflow-hidden velvet-section">
      <div className="museum-grid absolute inset-0 opacity-[0.03]" />
      
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center relative z-10">
        
        {/* Diamond Sigil */}
        <motion.div 
          whileHover={{ rotate: 135, scale: 1.1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-20 border border-rosegold/30 flex items-center justify-center mb-16 rotate-45 relative group cursor-pointer velvet-shadow"
        >
          <div className="absolute inset-0 bg-ruby/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="font-serif text-gold text-2xl font-thin -rotate-45 relative z-10 tracking-widest">KSP</span>
        </motion.div>

        <h2 className="font-serif text-[10px] md:text-sm text-ivory/60 tracking-[0.8em] mb-20 font-light uppercase">
          Proprietary Intelligence / Divine Archive
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 w-full max-w-5xl border-y border-rosegold/10 py-16 px-8 text-center bg-white/[0.02] velvet-shadow">
          {[
            { label: "Sonic Archive", link: "#" },
            { label: "Visual Codex", link: "#" },
            { label: "Central Armory", link: "#relics" },
            { label: "Authorization", link: "#oracle" }
          ].map((item) => (
            <a 
              key={item.label}
              href={item.link} 
              className="group flex flex-col items-center gap-2"
            >
              <span className="font-mono text-[9px] tracking-[0.4em] text-ivory/40 uppercase group-hover:text-gold transition-colors block">
                {item.label}
              </span>
              <div className="w-0 h-[1px] bg-gold/40 group-hover:w-full transition-all duration-700" />
            </a>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center space-y-6">
          <div className="flex items-center gap-4 opacity-20">
             <div className="w-1.5 h-1.5 rounded-full bg-gold" />
             <div className="w-1.5 h-1.5 rounded-full bg-rosegold" />
             <div className="w-1.5 h-1.5 rounded-full bg-ruby" />
          </div>
          <p className="font-mono text-[8px] text-ivory/20 tracking-[0.6em] uppercase">
            &copy; {new Date().getFullYear()} KINGSHADP // SECURED BY VAULT_OS
          </p>
        </div>
      </div>
    </footer>
  );
}

