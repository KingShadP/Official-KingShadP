"use client";

import { Reveal } from "@/components/system/Reveal";
import { TransitionLink } from "@/components/system/TransitionProvider";
import { SITE_MEDIA } from "@/lib/site-media";

export function SelectedArtifacts() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pb-28 md:pb-40">
      <Reveal className="mb-12">
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-3">
          Why enter
        </p>
        <h2 className="font-serif font-light text-4xl md:text-5xl text-ivory">
          A guided first impression.
        </h2>
        <p className="mt-4 max-w-2xl font-serif font-light text-lg md:text-xl leading-relaxed text-ivory/65">
          This site is not meant to feel like a storefront first or a social feed. It is designed as an immersive introduction to the KingShadP universe, then a path into the pieces, sounds, and symbols that define it.
        </p>
      </Reveal>

      <Reveal>
        <TransitionLink
          href="/visuals"
          className="group block overflow-hidden border border-ivory/10 bg-panel"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SITE_MEDIA.heroBackdrop}
            alt="Visuals preview"
            className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            draggable={false}
          />
          <div className="flex items-center justify-between gap-4 p-5 md:p-6">
            <span className="font-serif text-2xl md:text-3xl font-light text-ivory/90">Enter Visuals</span>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze">Open →</span>
          </div>
        </TransitionLink>
      </Reveal>
    </section>
  );
}
