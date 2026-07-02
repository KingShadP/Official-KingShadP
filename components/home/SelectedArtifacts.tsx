"use client";

import { Reveal } from "@/components/system/Reveal";
import { TransitionLink } from "@/components/system/TransitionProvider";
import { ArtifactTile } from "@/components/ArtifactTile";
import { ARTIFACTS } from "@/lib/content";

const SELECTED = ["SS-01", "CT-01", "IN-01"];

export function SelectedArtifacts() {
  const items = ARTIFACTS.filter((a) => SELECTED.includes(a.ref));

  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pb-28 md:pb-40">
      <Reveal className="flex items-end justify-between mb-12">
        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-3">
            Selected Artifacts
          </p>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-ivory">
            From the vault.
          </h2>
        </div>
        <TransitionLink
          href="/archive"
          className="hidden md:block font-mono text-[10px] tracking-[0.3em] uppercase text-ivory/50 hover:text-bronze transition-colors duration-300"
        >
          View all →
        </TransitionLink>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((a, i) => (
          <Reveal key={a.ref} delay={i * 0.1}>
            <ArtifactTile artifact={a} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 md:hidden">
        <TransitionLink
          href="/archive"
          className="font-mono text-[10px] tracking-[0.3em] uppercase text-ivory/50"
        >
          View all →
        </TransitionLink>
      </Reveal>
    </section>
  );
}
