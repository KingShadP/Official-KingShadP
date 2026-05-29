"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ScrambleText } from "./ScrambleText";

export const Hero = memo(function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center px-6 lg:px-24 overflow-hidden z-10 selection:bg-ivory selection:text-void">
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover filter contrast-125 saturate-50 brightness-75"
        >
          <source src="/Model_wearing_KingShadP_hoodie_202605270727.mp4.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-void/50 to-void pointer-events-none" />
      </div>

      <div className="absolute right-[-10vw] top-[10vh] text-[15vw] font-mono text-ivory/[0.02] mix-blend-overlay rotate-90 pointer-events-none uppercase whitespace-nowrap overflow-hidden">
        <ScrambleText text="[ SYSTEM CORE PRIME ]" duration={20000} delay={500} />
      </div>

      <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-12 text-[10px] font-mono text-ivory/30 tracking-[0.3em] uppercase">
        <span className="origin-left -rotate-90">Archive_v9.0</span>
        <span className="origin-left -rotate-90 text-oxblood">Sovereign_Active</span>
        <span className="origin-left -rotate-90">Class_Omega</span>
      </div>

      <div className="max-w-7xl mx-auto w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-12 h-[1px] bg-gold shadow-[0_0_10px_rgba(220,197,123,0.8)]" />
          <span className="font-mono text-xs text-oxblood uppercase tracking-[0.4em] font-bold drop-shadow-[0_0_8px_rgba(147,0,10,0.8)]">
            <ScrambleText text="System Initialization Required" duration={800} />
          </span>
        </motion.div>

        <div className="relative overflow-visible leading-[0.85] pb-4 group">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-serif text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[13rem] leading-[0.85] text-transparent font-light tracking-tighter"
            style={{
              WebkitTextStroke: "1px rgba(220, 197, 123, 0.2)",
              color: "rgba(244, 240, 236, 0.95)"
            }}
          >
            <span className="glitch-text-hover inline-block cursor-auto select-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">KING</span><br />
            <span className="glitch-text-hover inline-block cursor-auto select-none text-transparent bg-clip-text bg-gradient-to-b from-ivory to-ivory/20 drop-shadow-[0_0_60px_rgba(220,197,123,0.15)] relative">
              SHADP.
              <span className="absolute inset-0 bg-noise mix-blend-overlay opacity-50 pointer-events-none" />
            </span>
          </motion.h1>
        </div>

        <div className="mt-12 max-w-2xl">
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
            className="font-serif text-2xl md:text-3xl text-ivory/90 leading-relaxed font-light drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <ScrambleText text="The Creator. The Myth. The System Archive." delay={1000} duration={800} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
            className="mt-4 font-mono text-xs md:text-sm text-ivory/40 uppercase tracking-[0.2em] max-w-xl"
          >
            <ScrambleText text="I don't cater. I'm the creator that makes your universe greater." delay={1500} duration={1200} />
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] bg-gradient-to-r from-ivory/30 via-gold/40 to-transparent max-w-lg mt-16 shadow-[0_0_15px_rgba(220,197,123,0.6)]"
        />
      </div>
    </section>
  );
});
