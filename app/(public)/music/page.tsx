"use client";

import React from "react";
import { motion } from "framer-motion";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ArrowRight } from "lucide-react";

export default function MusicPage() {
  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="flex flex-col lg:flex-row gap-16 mt-6 items-start">
      <div className="flex-1 flex flex-col gap-6 text-left">
        <div className="font-mono text-[10px] text-[#93000a] uppercase tracking-widest">
          {"// AUDIO PLATFORM IN ORBIT"}
        </div>
        
        <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight font-light">
          The Audio Room.
        </h1>

        <p className="font-sans text-base text-white/70 font-light leading-relaxed max-w-xl">
          Sound inside KingShadP&apos;s digital room holds absolute structural priority. We operate on a warm, deep, organic frequency scale—free from heavy pop clutter. Our auditory drones feature spatial atmospheric synthesizers and calming sub-bass pulses that create profound stillness.
        </p>

        <div className="border-l border-[#dcc57b]/30 pl-5 py-2 my-4 bg-[#0c0a09]/40 rounded-r-lg">
          <p className="font-mono text-[10px] text-[#dcc57b] font-semibold uppercase tracking-wider">
            THE FREQUENCY PRINCIPLE
          </p>
          <p className="font-serif text-base text-white/60 italic font-light mt-1.5 leading-relaxed">
            &apos;Let the atmospheric frequencies hold their own shape and weight before you add any drums or details. Taste resides in knowing exactly what is not required.&apos;
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-[#dcc57b]/20 pt-8 mt-4 font-mono text-[10px] text-white/40">
          <div className="flex flex-col">
            <span>AUDIO ENCODING:</span>
            <span className="text-[#dcc57b] font-semibold text-xs mt-1">24-BIT / 96KHZ FLAC</span>
          </div>
          <div className="flex flex-col">
            <span>MONITOR SPECTRUM:</span>
            <span className="text-[#dcc57b] font-semibold text-xs mt-1">WARM TRIANGLE WAVE CORES</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[480px] shrink-0 border border-[#dcc57b]/20 rounded-xl overflow-hidden p-[1px] bg-[#0c0a09]/60 backdrop-blur-md">
        <AudioPlayer />
      </div>
    </motion.div>
  );
}
