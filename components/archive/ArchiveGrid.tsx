"use client";

import { Reveal } from "@/components/system/Reveal";
import { ArtifactTile } from "@/components/ArtifactTile";
import { ARTIFACTS } from "@/lib/content";

export function ArchiveGrid() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-36 md:pt-44 pb-28">
      <Reveal>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-4">
          Artifacts / Specifications
        </p>
        <h1 className="font-serif font-light text-5xl md:text-7xl text-ivory mb-6">
          The Archive
        </h1>
        <p className="font-serif italic font-light text-ivory/55 max-w-md text-base md:text-lg">
          Objects of the house, catalogued. Each piece carries the Giragon
          insignia or the source crest.
        </p>
        <div className="rule mt-14" />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-14">
        {ARTIFACTS.map((a, i) => (
          <Reveal
            key={a.ref}
            delay={(i % 3) * 0.08}
            className={`${a.span ?? "md:col-span-4"} ${
              i % 3 === 1 ? "md:mt-14" : ""
            }`}
          >
            <ArtifactTile artifact={a} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-24 text-center">
        <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-ivory/30">
          More artifacts are being prepared for future release.
        </p>
      </Reveal>
    </section>
  );
}
