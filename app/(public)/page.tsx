"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hologram } from "@/components/Hologram";
import { ArchiveGraph } from "@/components/ArchiveGraph";
import { FadeInScroll } from "@/components/FadeInScroll";
import { ArrowRight, Sparkles, Music, Shirt } from "lucide-react";

export default function Home() {
  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="flex flex-col gap-24 text-left">
      
      {/* Hero Section */}
      <FadeInScroll>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-[#dcc57b]/20 pb-12">
          <div className="flex-1 flex flex-col gap-6 max-w-3xl">
            <div className="font-mono text-[10px] text-[#93000a] uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#93000a]" />
              <span>PRISTINE PORTFOLIO & CREATIVE ARCHIVE</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight font-light leading-[1.05]">
              Sovereign Art & <span className="italic text-[#dcc57b] font-normal font-serif">Creative</span> Direction.
            </h1>

            <p className="font-sans text-base text-white/80 font-light leading-relaxed max-w-2xl">
              An independent experimental design studio and conceptual archive producing limited-edition physical garments, deep auditory frequencies, and immersive digital installations.
            </p>

            {/* High-contrast Primary & Secondary CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <a 
                href="/fashion"
                className="bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] font-mono text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-bold transition-all hover:scale-[1.03] active:scale-[0.97] shadow-[0_4px_20px_rgba(220,197,123,0.25)] flex items-center gap-2"
              >
                Browse Lookbook <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a 
                href="/music"
                className="border border-[#dcc57b]/40 hover:border-white text-[#dcc57b] hover:text-white bg-transparent font-mono text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-lg font-semibold transition-all hover:scale-[1.03]"
              >
                [ Enter Sonic Vault ]
              </a>
              <a 
                href="/archive"
                className="border border-white/10 hover:border-[#93000a] text-white/50 hover:text-white bg-transparent font-mono text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-lg transition-all hover:scale-[1.03]"
              >
                [ View Classified Archive ]
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 font-mono text-[11px] border border-[#dcc57b]/30 bg-[#0c0a09]/60 backdrop-blur-md p-6 rounded-xl shadow-sm w-full md:w-80 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <svg width="40" height="40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#dcc57b" strokeWidth="1" fill="none" strokeDasharray="4 8" />
              </svg>
            </div>
            <div className="flex justify-between border-b border-[#dcc57b]/20 pb-2">
              <span className="text-white/40">CREATOR:</span>
              <span className="text-[#dcc57b] font-semibold">KING SHAD P</span>
            </div>
            <div className="flex justify-between border-b border-[#dcc57b]/20 pb-2">
              <span className="text-white/40">ESTABLISHED:</span>
              <span className="text-white">2026 SERIES</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-white/40">LOCATION:</span>
              <span className="text-[#93000a] font-medium animate-pulse">STUDIO MATRIX</span>
            </div>
          </div>
        </div>
      </FadeInScroll>

      {/* Video Preview Section */}
      <FadeInScroll>
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,197,123,0.05)] border border-[#dcc57b]/20 group">
          <video
            src="/Product_worn_on_model_202605270708.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090908]/90 via-[#090908]/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#dcc57b] block mb-2">CAMPAGN PREVIEW</span>
            <h3 className="font-serif text-3xl md:text-5xl font-light italic text-[#f4ecd8]">Tailored Heavy Cotton</h3>
            <p className="font-sans text-xs text-white/60 max-w-md mt-2 font-light">
              Constructed with heavy-weight loopback organic textiles, laser stitched seam marks, and high-density geometric lines.
            </p>
          </div>
        </div>
      </FadeInScroll>

      {/* Interactive Bento Grid */}
      <FadeInScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Hologram />
          <ArchiveGraph />
        </div>
      </FadeInScroll>

      {/* Core Brand Pillars */}
      <FadeInScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-6">
          <div className="flex flex-col gap-4 border-l border-[#dcc57b]/30 pl-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#dcc57b]/50">PILLAR 01</span>
            <h4 className="font-serif text-2xl text-white">Absolute Restraint</h4>
            <p className="font-sans text-sm text-white/50 leading-relaxed font-light">
              We believe taste is defined purely by what we choose to exclude. Each product, pixel, and sound wave exists under strict visual priority.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 border-l border-[#dcc57b]/30 pl-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#dcc57b]/50">PILLAR 02</span>
            <h4 className="font-serif text-2xl text-white">Durable Sovereignty</h4>
            <p className="font-sans text-sm text-white/50 leading-relaxed font-light">
              Built upon the confidence doctrine that human souls share equal, sacred, infinite worth. We do not beg or compromise creative pathways.
            </p>
          </div>

          <div className="flex flex-col gap-4 border-l border-[#dcc57b]/30 pl-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#dcc57b]/50">PILLAR 03</span>
            <h4 className="font-serif text-2xl text-white">Atmospheric Focus</h4>
            <p className="font-sans text-sm text-white/50 leading-relaxed font-light">
              Fusing raw tangible textiles with deeply filtered sound. Our releases speak for themselves long before details are read.
            </p>
          </div>
        </div>
      </FadeInScroll>

      {/* Quick Navigation Cards */}
      <FadeInScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#dcc57b]/20 pt-16">
          <div className="bg-[#0c0a09]/60 backdrop-blur-md border border-[#dcc57b]/20 p-8 rounded-2xl shadow-sm flex flex-col justify-between gap-8 hover:border-[#dcc57b]/50 transition-colors group">
            <div className="flex flex-col gap-4">
              <Music className="w-8 h-8 text-[#dcc57b] group-hover:scale-110 transition-transform" />
              <h4 className="font-serif text-3xl font-light text-white">High-Fidelity Audio Room</h4>
              <p className="font-sans text-sm text-white/50 font-light leading-relaxed">
                Access our custom luxury audio room to stream deeply warm ambient triangle wave synthesizers and studio-grade soundscapes.
              </p>
            </div>
            <a 
              href="/music" 
              className="inline-flex items-center gap-2 font-mono text-[11px] text-[#dcc57b] uppercase tracking-widest font-semibold hover:tracking-[0.25em] transition-all"
            >
              Enter Audio Room <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-[#dcc57b] text-[#090908] p-8 rounded-2xl shadow-lg flex flex-col justify-between gap-8 hover:bg-[#ebd58b] transition-colors group">
            <div className="flex flex-col gap-4">
              <Shirt className="w-8 h-8 text-[#090908]" />
              <h4 className="font-serif text-3xl font-light text-[#090908]">Heavy Cotton Lookbook</h4>
              <p className="font-sans text-sm text-[#090908]/70 font-light leading-relaxed">
                Examine the full architectural collection of premium soft shells, water-tight rain chambers, and organic combed jerseys.
              </p>
            </div>
            <a 
              href="/fashion" 
              className="inline-flex items-center gap-2 font-mono text-[11px] text-[#090908] uppercase tracking-widest font-semibold hover:tracking-[0.25em] transition-all"
            >
              Browse Lookbook <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </FadeInScroll>

    </motion.div>
  );
}
