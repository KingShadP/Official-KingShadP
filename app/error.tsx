"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("System boundary caught error:", error);
  }, [error]);

  return (
    <main id="error-boundary-container" className="relative min-h-screen bg-void text-ivory flex flex-col items-center justify-center p-8 selection:bg-oxblood selection:text-white">
      {/* Background Subtle noise */}
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center max-w-lg">
        {/* Telemetry Label */}
        <p className="font-mono text-[10px] text-oxblood tracking-[0.4em] uppercase mb-6 animate-pulse">
          [ CRITICAL_SYSTEM_ERROR // COMPILING_HALT ]
        </p>

        {/* Cinematic Typography heading */}
        <h1 className="font-serif text-5xl md:text-7xl font-light italic tracking-tight mb-8">
          System Failure<span className="text-gold">.</span>
        </h1>

        {/* Restrained elegant divider line */}
        <div className="w-16 h-[0.5px] bg-ivory/30 mb-8" />

        {/* High-end description copy */}
        <p className="font-mono text-xs text-ivory/60 tracking-[0.1em] uppercase leading-relaxed mb-4">
          A disruption has been logged in the active environment.
        </p>
        {error.digest && (
          <p className="font-mono text-[9px] text-gold/60 tracking-[0.15em] uppercase mb-12">
            DIGEST: // {error.digest}
          </p>
        )}

        {/* Action controls */}
        <div className="flex gap-6">
          <button
            onClick={() => reset()}
            className="font-mono text-xs tracking-[0.2em] uppercase border border-ivory hover:border-gold hover:text-gold px-8 py-3 bg-transparent text-ivory transition-colors cursor-crosshair"
          >
            [ Reset_Core ]
          </button>
          <Link
            href="/"
            className="font-mono text-xs tracking-[0.2em] uppercase border border-ivory/30 hover:border-gold hover:text-gold px-8 py-3 transition-colors inline-block decoration-none"
            style={{ textDecoration: "none" }}
          >
            [ Return_Hold ]
          </Link>
        </div>
      </div>
    </main>
  );
}
