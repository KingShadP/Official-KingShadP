"use client";

import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="bg-void pt-32 pb-16 px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-[100rem] mx-auto border-t border-ivory/10 pt-20 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
        
        <div>
           <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-ivory/50 block mb-2">Platform</span>
           <span className="font-serif text-3xl font-light italic text-ivory/80 block">Archive System</span>
        </div>

        <div className="flex gap-12 font-mono text-[9px] uppercase tracking-[0.4em] text-ivory/40">
           <a href="#vault" className="hover:text-ivory transition-colors">Vault</a>
           <a href="#codex" className="hover:text-ivory transition-colors">Codex</a>
           <a href="#oracle" className="hover:text-ivory transition-colors">Oracle</a>
        </div>

        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-ivory/30">
          Intx {new Date().getFullYear()} &copy;
        </div>

      </div>
    </footer>
  );
}

