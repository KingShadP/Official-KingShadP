"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="not-found-container" className="relative min-h-screen bg-[#090908] text-[#faf8f5] flex flex-col items-center justify-center p-8 selection:bg-[#93000a] selection:text-white">
      {/* Background Subtle noise */}
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center max-w-lg">
        {/* Telemetry Label */}
        <p className="font-mono text-[10px] text-[#93000a] tracking-[0.4em] uppercase mb-6 animate-pulse">
          [ ERROR_404 // ROUTE_NOT_FOUND ]
        </p>

        {/* Cinematic Typography heading */}
        <h1 className="font-serif text-5xl md:text-7xl font-light italic tracking-tight mb-8">
          Signal Lost<span className="text-[#dcc57b]">.</span>
        </h1>

        {/* Restrained elegant divider line */}
        <div className="w-16 h-[0.5px] bg-[#faf8f5]/30 mb-8" />

        {/* High-end description copy */}
        <p className="font-mono text-xs text-[#faf8f5]/60 tracking-[0.1em] uppercase leading-relaxed mb-12">
          The requested coordinate does not exist in our active sector.
        </p>

        {/* Action control */}
        <div>
          <Link
            href="/"
            className="font-mono text-xs tracking-[0.2em] uppercase border border-[#faf8f5] hover:border-[#dcc57b] hover:text-[#dcc57b] px-8 py-3 bg-transparent text-[#faf8f5] transition-colors inline-block decoration-none cursor-crosshair"
            style={{ textDecoration: "none" }}
          >
            [ Return_Hold ]
          </Link>
        </div>
      </div>
    </main>
  );
}
