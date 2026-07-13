"use client";

import React from "react";
import { motion } from "framer-motion";
import { Orbit, Compass, Landmark, Sparkles } from "lucide-react";

export default function AboutPage() {
  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const timeline = [
    { year: "2024", event: "Initial frequency transmission 'The Verse' launched on private channels." },
    { year: "2025", event: "Portuguese Textile Labs partnership established for 500 GSM loopback development." },
    { year: "2026", event: "System Archive interface deployed and secure AI Concierge activated." }
  ];

  return (
    <motion.div {...viewTransition} className="flex flex-col gap-24 mt-6">
      
      {/* Intro */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-[#dcc57b]/20 pb-12">
        <div className="flex-1 flex flex-col gap-6 max-w-3xl">
          <div className="font-mono text-[10px] text-[#93000a] uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE BIOGRAPHY AND MULTIDISCIPLINARY FOUNDATION</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tight font-light leading-none">
            Our Story.
          </h1>
          <p className="font-sans text-base text-white/80 font-light leading-relaxed max-w-2xl">
            KingShadP is a premium multidisciplinary studio with deep artistic roots spanning Miami and Honolulu, Hawai&apos;i. Rejecting the surface noise of temporary streetwear trends, we create structured physical shelter, auditory frequencies, and experimental interactive portals.
          </p>
        </div>

        <div className="flex flex-col gap-3 font-mono text-[11px] border border-[#dcc57b]/30 bg-[#0c0a09]/60 backdrop-blur-md p-6 rounded-xl shadow-sm w-full md:w-80">
          <div className="flex justify-between border-b border-[#dcc57b]/20 pb-2">
            <span className="text-white/40">CREATIVE COORDS:</span>
            <span className="text-[#dcc57b] font-semibold">MIAMI & HONOLULU</span>
          </div>
          <div className="flex justify-between border-b border-[#dcc57b]/20 pb-2">
            <span className="text-white/40">DISCIPLINES:</span>
            <span className="text-white">SOUND, GARMENT, PORTAL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">PHILOSOPHY:</span>
            <span className="text-white">ABSOLUTE RESTRAINT</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col gap-4 border-l border-[#dcc57b]/20 pl-6">
          <Landmark className="w-6 h-6 text-[#dcc57b] mb-2" />
          <h3 className="font-serif text-2xl text-white font-light">The Two Oceans</h3>
          <p className="font-sans text-sm text-white/50 leading-relaxed font-light">
            Formed by the constant contrast between Miami&apos;s dynamic architectural neon lines and Honolulu&apos;s immersive Pacific quietude. We synthesize these raw environmental energies into solid creative matter.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-l border-[#dcc57b]/20 pl-6">
          <Compass className="w-6 h-6 text-[#dcc57b] mb-2" />
          <h3 className="font-serif text-2xl text-white font-light">Tactile Shelter</h3>
          <p className="font-sans text-sm text-white/50 leading-relaxed font-light">
            We treat clothing as temporary architecture. By utilizing 500 GSM Portuguese organic heavy cotton loops, we discard branding insignias to place complete emphasis on raw drape, seam vectors, and structural weight.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-l border-[#dcc57b]/20 pl-6">
          <Orbit className="w-6 h-6 text-[#dcc57b] mb-2" />
          <h3 className="font-serif text-2xl text-white font-light">Sovereign Sound</h3>
          <p className="font-sans text-sm text-white/50 leading-relaxed font-light">
            Our audio releases act as continuous planetary coordinates. Formed on a custom 110Hz triangle wave matrix, the low drones block out digital notification fatigue, offering profound focus and command presence.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t border-[#dcc57b]/20 pt-16 flex flex-col gap-10">
        <div className="text-left flex flex-col gap-2">
          <span className="font-mono text-[9px] text-[#93000a] tracking-widest uppercase">{"// SOVEREIGN CHRONOLOGY"}</span>
          <h3 className="font-serif text-3xl text-white font-light">Ecosystem Benchmarks</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {timeline.map((item, index) => (
            <div key={index} className="bg-[#0c0a09]/40 border border-[#dcc57b]/10 hover:border-[#dcc57b]/30 p-6 rounded-xl flex flex-col gap-4 text-left transition-colors">
              <span className="font-mono text-2xl text-[#dcc57b] font-bold">{item.year}</span>
              <div className="w-8 h-[1px] bg-[#93000a]" />
              <p className="font-sans text-xs text-white/70 leading-relaxed font-light">{item.event}</p>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
