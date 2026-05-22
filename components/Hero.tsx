"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useTextScramble } from "@/lib/hooks/useTextScramble";

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity1 = useTransform(scrollY, [0, 600], [1, 0]);
  const textY = useTransform(scrollY, [0, 800], [0, 400]);
  const blurValue = useTransform(scrollY, [0, 600], ["blur(0px)", "blur(20px)"]);
  
  const title1 = useTextScramble("THE GOD.");
  const title2 = useTextScramble("KINGSHADP");

  return (
    <section id="vault" className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden bg-void">
      {/* Background Media Architecture */}
      <motion.div 
        className="absolute inset-x-0 top-0 h-[100vh] origin-top will-change-transform"
        style={{ y: y1, opacity: opacity1, filter: blurValue }}
      >
        <motion.div
           initial={{ opacity: 0, scale: 1.15 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 6, ease: [0.16, 1, 0.3, 1] }}
           className="w-full h-full relative"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover filter grayscale-[0.8] contrast-[1.4] sepia-[0.3] opacity-60 mix-blend-screen"
          >
            <source src="/imagine-0a15cc32.mp4" type="video/mp4" />
          </video>
          {/* Subtle slow pulsing radiant aura behind the text */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40 animate-pulse" style={{ animationDuration: "8s" }} />
        </motion.div>
        
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/5 to-void z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] z-10 opacity-80" />
      </motion.div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-30 mix-blend-overlay flex justify-center items-center overflow-hidden">
        <svg height="100%" width="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.6" />
        </svg>
      </div>

      {/* Structural Grids */}
      <div className="absolute inset-0 z-10 grid grid-cols-4 max-w-screen-2xl mx-auto pointer-events-none opacity-[0.03]">
        <div className="border-r border-ivory h-full w-full" />
        <div className="border-r border-ivory h-full w-full" />
        <div className="border-r border-ivory h-full w-full" />
        <div className="h-full w-full" />
      </div>

      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center text-center w-full px-4 mix-blend-difference"
        style={{ y: textY }}
      >
        <div className="flex flex-col items-center">
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6 mb-12"
          >
            <span className="w-16 h-[1px] bg-ivory/30"></span>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-ivory shadow-[0_0_15px_#fff] animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-ivory/90 font-semibold">
                Origin_Node // Established
              </span>
            </div>
            <span className="w-16 h-[1px] bg-ivory/30"></span>
          </motion.div>

          {/* Typography Masked Reveal */}
          <div className="overflow-hidden relative leading-[0.8] pb-4">
             <motion.h1 
                initial={{ y: "150%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[18vw] md:text-[15vw] font-light text-ivory tracking-tighter mix-blend-lighten drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
             >
               {title1}
             </motion.h1>
          </div>
          <div className="overflow-hidden relative leading-[0.8]">
             <motion.h1 
                initial={{ y: "150%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[18vw] md:text-[15vw] font-light text-transparent bg-clip-text bg-gradient-to-b from-ivory via-ivory/80 to-ivory/20 tracking-tighter mix-blend-plus-lighter"
             >
               {title2}
             </motion.h1>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 3, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 max-w-2xl font-serif text-lg sm:text-xl md:text-2xl text-ivory/50 leading-relaxed font-light mx-auto tracking-wide"
        >
          <span className="text-ivory/80">The God. The Gold Standard.</span> <br /> 
          Identity transformed into mythology.
        </motion.p>
      </motion.div>

      {/* Down indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 2.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 group cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-ivory/30 group-hover:text-ivory/80 transition-colors duration-500">Descend</span>
        <div className="w-[1px] h-16 bg-ivory/10 overflow-hidden relative">
          <motion.div 
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-ivory to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
