"use client";

import { memo } from "react";
import Link from "next/link";

export const Footer = memo(function Footer() {
  return (
    <footer className="w-full py-12 px-6 lg:px-24 border-t border-[#dcc57b]/20 z-10 bg-[#090908] relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-serif text-xl tracking-[0.1em] uppercase font-light text-white">KING SHAD P</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#dcc57b]/60">
            © 2026 KING SHAD P // ALL RIGHTS RESERVED
          </span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
          <Link href="/" className="hover:text-[#dcc57b] transition-colors">Home</Link>
          <Link href="/music" className="hover:text-[#dcc57b] transition-colors">Music</Link>
          <Link href="/fashion" className="hover:text-[#dcc57b] transition-colors">Lookbook</Link>
          <Link href="/archive" className="hover:text-[#dcc57b] transition-colors">Archive</Link>
          <Link href="/campaigns" className="hover:text-[#dcc57b] transition-colors">Manifesto</Link>
          <Link href="/contact" className="hover:text-[#dcc57b] transition-colors">Inquire</Link>
          <Link href="/privacy" className="hover:text-[#dcc57b] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#dcc57b] transition-colors">Terms</Link>
          <Link href="/accessibility" className="hover:text-[#dcc57b] transition-colors">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
});

