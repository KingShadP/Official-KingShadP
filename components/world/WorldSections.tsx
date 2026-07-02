"use client";

import { Reveal } from "@/components/system/Reveal";
import { WORLD_SECTIONS } from "@/lib/content";

export function WorldSections() {
  return (
    <div className="relative">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-36 md:pt-44 pb-10">
        <Reveal>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-4">
            Doctrine / House Codes
          </p>
          <h1 className="font-serif font-light text-5xl md:text-7xl text-ivory">
            The World
          </h1>
        </Reveal>
      </section>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-6 lg:px-0">
        {WORLD_SECTIONS.map((s, i) => (
          <section
            key={s.kicker}
            className="py-20 md:py-28 border-t border-ivory/10 first:border-t-0"
          >
            <Reveal>
              <div className="flex items-baseline gap-5 mb-8">
                <span className="font-mono text-[10px] text-bronze/70 tracking-[0.3em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-ivory/40">
                  {s.kicker}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-serif italic font-light text-3xl md:text-5xl text-ivory mb-10 leading-tight">
                {s.title}
              </h2>
            </Reveal>
            <div className="space-y-6">
              {s.body.map((p, j) => (
                <Reveal key={j} delay={0.12 + j * 0.05}>
                  <p className="font-serif font-light text-ivory/70 text-lg md:text-xl leading-relaxed">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Closing mark */}
      <section className="border-t border-ivory/10">
        <Reveal className="max-w-3xl mx-auto px-6 py-24 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/crest.webp"
            alt="KingShadP crest"
            loading="lazy"
            draggable={false}
            className="w-28 mx-auto opacity-80"
          />
          <p className="mt-8 font-mono text-[9px] tracking-[0.45em] uppercase text-ivory/35">
            The crown with a conscience.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
