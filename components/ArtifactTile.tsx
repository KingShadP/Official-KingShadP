"use client";

import type { Artifact } from "@/lib/content";

/**
 * Archive tile with hover reveal: the plate lifts, the image warms,
 * and the telemetry line slides in. CSS-only — no JS per frame.
 */
export function ArtifactTile({ artifact }: { artifact: Artifact }) {
  return (
    <div className="group relative" data-cursor>
      <div className="relative aspect-[4/5] overflow-hidden border border-ivory/10 bg-panel transition-colors duration-500 group-hover:border-bronze/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artifact.img}
          alt={artifact.name}
          loading="lazy"
          draggable={false}
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out group-hover:scale-[1.04] ${
            artifact.contain
              ? "object-contain p-10"
              : "object-cover opacity-90 saturate-[0.65] group-hover:saturate-100 group-hover:opacity-100"
          }`}
        />
        {/* Bronze hairline that draws across on hover */}
        <span className="absolute bottom-0 left-0 right-0 h-px bg-bronze origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div className="overflow-hidden">
          <h3 className="font-serif font-light text-lg text-ivory/85 group-hover:text-ivory transition-colors duration-300">
            {artifact.name}
          </h3>
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-ivory/35 mt-1 translate-y-0 md:translate-y-2 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            {artifact.spec}
          </p>
        </div>
        <span className="font-mono text-[9px] tracking-[0.25em] text-bronze/70">
          {artifact.ref}
        </span>
      </div>
    </div>
  );
}
