"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useTextScramble } from "@/lib/hooks/useTextScramble";
import Image from "next/image";

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0]);
  const textY = useTransform(scrollY, [0, 400], [0, 100]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  
  const title1 = useTextScramble("OFFICIAL /");
  const title2 = useTextScramble("KINGSHADP");

  return (
    <section id="vault" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Media Architecture */}
      <motion.div 
        className="absolute inset-0 z-0 h-[120%]"
        style={{ y: y1, opacity: opacity1 }}
      >
        <Image
          src="/ChatGPT Image May 16, 2026, 03_49_21 AM (2).png"
          alt="Cinematic Depth"
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover opacity-40 mix-blend-screen filter grayscale-[0.3] sepia-[0.1] contrast-[1.1] scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/10 via-void/40 to-void z-10" />
      </motion.div>

      {/* OS Telemetry Grid */}
      <div className="absolute inset-0 z-10 border-x border-rosegold/5 max-w-7xl mx-auto hidden md:block pointer-events-none">
        <div className="w-[1px] h-full bg-rosegold/5 absolute left-1/4" />
        <div className="w-[1px] h-full bg-rosegold/5 absolute right-1/4" />
      </div>

      {/* Marquee Background */}
      <div className="absolute top-1/3 w-full -rotate-6 z-10 pointer-events-none overflow-hidden mix-blend-overlay opacity-10">
        <motion.div
           animate={{ x: [0, -2000] }}
           transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
           className="flex whitespace-nowrap font-serif text-[20vw] leading-none uppercase tracking-tighter"
        >
           <span className="px-10">Official KingShadP // System Alpha</span>
           <span className="px-10">Official KingShadP // System Alpha</span>
           <span className="px-10">Official KingShadP // System Alpha</span>
        </motion.div>
      </div>

      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center text-center w-full px-4"
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.div
           initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Status Badge */}
          <div className="flex items-center gap-6 mb-8">
            <span className="w-20 h-[1px] bg-rosegold/30"></span>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-ruby shadow-[0_0_10px_#B21F36] animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-gold font-semibold italic">
                Active_Link // Sys_001
              </span>
            </div>
            <span className="w-20 h-[1px] bg-rosegold/30"></span>
          </div>

          <h1 className="font-serif text-[18vw] leading-[0.7] font-light text-ivory tracking-tighter mix-blend-difference z-20 relative">
            {title1}
          </h1>
          <h1 className="font-serif text-[18vw] leading-[0.7] font-light text-transparent bg-clip-text bg-gradient-to-b from-ruby via-crimson to-oxblood tracking-tighter -mt-4 text-glow-rosegold z-20 relative">
            {title2}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="mt-16 max-w-3xl font-serif text-2xl md:text-4xl text-ivory/60 leading-relaxed font-light"
        >
          &ldquo;Identity transformed into <span className="italic text-rosegold/80 font-medium">mythology</span>. 
          The creator built the vault. <br className="hidden md:block" /> The creation survived it.&rdquo;
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, delay: 1.8, ease: "easeOut" }}
           className="mt-20 flex items-center gap-12"
        >
           <a href="#artifacts" className="group flex flex-col items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-ivory/60 group-hover:text-gold transition-colors duration-500">Exhibit_Library</span>
              <div className="w-px h-16 bg-gradient-to-b from-rosegold/40 to-transparent group-hover:h-24 transition-all duration-1000" />
           </a>
        </motion.div>
      </motion.div>

      {/* Rails */}
      <div className="absolute right-12 bottom-12 hidden lg:flex flex-col items-end gap-2 font-mono text-[8px] text-ivory/20 tracking-[0.5em] uppercase text-right">
        <span>sys.archive // code_divine</span>
        <span>authorization: levels_omega</span>
      </div>
    </section>
  );
}
