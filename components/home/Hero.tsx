"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { TransitionLink } from "@/components/system/TransitionProvider";
import { EASE } from "@/lib/motion";
import { SITE_MEDIA } from "@/lib/site-media";

/**
 * Hero — three parallax layers (architecture lines, Giragon plate, type),
 * driven by transform-only motion values. Optional ambient video layer.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [ambient, setAmbient] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yArt = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 140]);
  const yType = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);
  const oFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: EASE },
  });

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden flex items-end">
      {/* Layer 0 — architecture: warm glow + column hairlines */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 100%, rgba(192,141,93,0.13), transparent 65%), radial-gradient(ellipse 60% 40% at 50% 0%, rgba(192,141,93,0.05), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 158px, rgba(242,237,228,0.5) 159px, transparent 161px)",
        }}
      />

      {/* Optional ambient backdrop layer */}
      {ambient && (
        <motion.img
          key="ambient"
          src={SITE_MEDIA.heroBackdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover saturate-[0.4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.16 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      )}

      {/* Layer 1 — the Giragon plate, drifting slower than scroll */}
      <motion.div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: yArt, opacity: oFade }}
      >
        <motion.img
          src={SITE_MEDIA.heroPlate}
          alt=""
          draggable={false}
          className="w-[62vmin] max-w-[560px] opacity-[0.33] select-none"
          initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
          animate={{ opacity: 0.33, scale: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: EASE }}
        />
      </motion.div>

      {/* Vignette for type legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-void via-void/55 to-transparent"
      />

      {/* Layer 2 — type */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-[12svh]"
        style={{ y: yType, opacity: oFade }}
      >
        <motion.p
          {...enter(0.25)}
          className="font-mono text-[10px] md:text-xs text-bronze tracking-[0.45em] uppercase mb-6"
        >
          Music / Image / Story / World
        </motion.p>

        <motion.h1
          {...enter(0.4)}
          className="font-serif font-light text-ivory uppercase leading-[0.95] tracking-tight text-[16vw] md:text-[10.5vw] lg:text-[9vw] select-none"
        >
          KingShadP
        </motion.h1>

        <motion.div {...enter(0.6)} className="mt-8 flex flex-wrap items-center gap-8">
          <p className="font-serif italic font-light text-ivory/65 text-base md:text-lg max-w-md">
            The official creative house — an artist-built archive of sound,
            visuals, symbols, and story.
          </p>
          <div className="flex gap-4">
            <TransitionLink
              href="/archive"
              className="px-6 py-3 border border-bronze/40 hover:border-bronze hover:bg-bronze/10 transition-all duration-500 font-mono text-[10px] uppercase tracking-[0.3em] text-bronze"
            >
              Enter the Archive
            </TransitionLink>
            <TransitionLink
              href="/music"
              className="px-6 py-3 border border-ivory/15 hover:border-ivory/50 transition-all duration-500 font-mono text-[10px] uppercase tracking-[0.3em] text-ivory/70"
            >
              Listen
            </TransitionLink>
          </div>
        </motion.div>
      </motion.div>

      {/* Ambient toggle */}
      <motion.button
        {...enter(1)}
        onClick={() => setAmbient((v) => !v)}
        className="absolute bottom-6 right-6 lg:right-12 z-20 font-mono text-[9px] tracking-[0.35em] uppercase text-ivory/40 hover:text-bronze transition-colors duration-300"
        aria-pressed={ambient}
      >
        Atmosphere — {ambient ? "On" : "Off"}
      </motion.button>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        style={{ opacity: oFade }}
      >
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-transparent via-bronze/60 to-transparent"
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
