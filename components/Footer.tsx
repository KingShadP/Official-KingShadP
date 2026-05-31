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
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Read our Awwwards review" className="text-ivory/40 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold p-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </a>
            <a href="#" aria-label="View FWA site of the day" className="text-ivory/40 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold p-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </a>
          </div>
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
