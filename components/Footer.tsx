"use client";

import { memo } from "react";
import { Activity } from "lucide-react";

export const Footer = memo(function Footer() {
  return (
    <footer className="w-full py-12 px-6 lg:px-24 border-t border-ivory/10 z-10 bg-void relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-serif text-2xl italic font-light text-ivory/80">KingShadP<span className="text-oxblood">.</span></span>
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-ivory/30">
            Sovereign Architecture // All Rights Reserved
          </span>
        </div>
        
        <div className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-[0.4em] text-ivory/40">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-gold" />
            <span>Sys.Online</span>
          </div>
          <span className="w-[1px] h-3 bg-ivory/20" />
          <span>v9.0.01</span>
        </div>
      </div>
    </footer>
  );
});
