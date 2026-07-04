"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/system/Reveal";
import { TransitionLink } from "@/components/system/TransitionProvider";
import { EASE } from "@/lib/motion";
import { SITE_MEDIA } from "@/lib/site-media";

const ROWS = [
  {
    href: "/archive",
    index: "01",
    title: "The Archive",
    note: "Artifacts / Specifications",
    img: SITE_MEDIA.collectionMark,
  },
  {
    href: "/music",
    index: "02",
    title: "The Sound",
    note: "Sonic Vault / Vol. 1",
    img: SITE_MEDIA.soundMark,
  },
  {
    href: "/world",
    index: "03",
    title: "The World",
    note: "Doctrine / House Codes",
    img: SITE_MEDIA.worldMark,
  },
];

/** Motion navigation — three ranked rows with a floating hover reveal. */
export function SystemIndex() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-12 py-28 md:py-40">
      <Reveal>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-3">
          Index
        </p>
        <h2 className="font-serif font-light text-4xl md:text-5xl text-ivory mb-16">
          One system. Three rooms.
        </h2>
      </Reveal>

      <div className="relative border-t border-ivory/10" onMouseLeave={() => setActive(null)}>
        {ROWS.map((row, i) => (
          <Reveal key={row.href} delay={i * 0.08}>
            <TransitionLink
              href={row.href}
              className="group relative flex items-baseline justify-between gap-6 py-9 md:py-12 border-b border-ivory/10"
            >
              <div
                className="flex items-baseline gap-6"
                onMouseEnter={() => setActive(i)}
              >
                <span className="font-mono text-[10px] text-bronze/70 tracking-[0.3em]">
                  {row.index}
                </span>
                <span className="font-serif italic font-light text-4xl md:text-6xl text-ivory/80 group-hover:text-ivory group-hover:translate-x-3 transition-all duration-500 ease-out">
                  {row.title}
                </span>
              </div>
              <span className="hidden md:block font-mono text-[9px] tracking-[0.35em] uppercase text-ivory/35 group-hover:text-bronze transition-colors duration-500">
                {row.note} →
              </span>
            </TransitionLink>
          </Reveal>
        ))}

        {/* Floating preview plate */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              className="hidden lg:block absolute right-[18%] top-1/2 -translate-y-1/2 w-[240px] h-[300px] pointer-events-none z-10 overflow-hidden border border-ivory/10 bg-panel"
              initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ROWS[active].img}
                alt={`${ROWS[active].title} preview`}
                className="w-full h-full object-contain p-6 opacity-90"
                draggable={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
