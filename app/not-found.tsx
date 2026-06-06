"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main id="not-found-container" className="relative min-h-screen bg-void text-ivory flex flex-col items-center justify-center p-8 selection:bg-oxblood selection:text-white">
      {/* Background Subtle noise */}
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none" />
      
      <div className="relative z-10 text-center flex flex-col items-center max-w-lg">
        {/* Telemetry Index decoration */}
        <p className="font-mono text-[10px] text-oxblood tracking-[0.4em] uppercase mb-6 animate-pulse">
          [ ACCESS_ERROR_404 // DECRYPTED_VOID ]
        </p>

        {/* Cinematic Typography heading */}
        <h1 className="font-serif text-5xl md:text-7xl font-light italic tracking-tight mb-8">
          Not Found<span className="text-gold">.</span>
        </h1>

        {/* Restrained elegant divider line */}
        <div className="w-16 h-[0.5px] bg-ivory/30 mb-8" />

        {/* High-end description copy */}
        <p className="font-mono text-xs text-ivory/60 tracking-[0.1em] uppercase leading-relaxed mb-12">
          The requested coordinate does not exist within the current system archive. Restraint dictates return.
        </p>

        {/* Minimal ghost button CTA */}
        <Link 
          href="/" 
          className="font-mono text-xs tracking-[0.2em] uppercase border border-ivory hover:border-gold hover:text-gold px-8 py-3 transition-colors inline-block decoration-none"
          style={{ textDecoration: "none" }}
        >
          [ Go Back // Return to Core ]
        </Link>
      </div>
    </main>
  );
}
