"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ArtifactCard } from "@/components/ArtifactCard";
import { Search } from "lucide-react";
const codexMedia = "/regenerated_image_1779241202319.png";

const loreFragments = [
  {
    id: "CODE_001",
    classification: "Foundational Memory",
    title: "The First Crown",
    content: "We fashioned a sovereign not out of gold, but out of expectation. The weight was immediate. It was never meant to be comfortable."
  },
  {
    id: "CODE_002",
    classification: "Architect's Note",
    title: "Symmetry of the Void",
    content: "If the mirror reflects the ghost, then who is the master giving the command? The archive holds the silence between those two questions."
  },
  {
    id: "CODE_003",
    classification: "Encrypted Protocol",
    title: "The Ruby Seal",
    content: "Authorization denied to those without the mark. The vault opens only when the myth recognizes the blood of its creator."
  }
];

export function LoreArchive() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFragments = loreFragments.filter(
    (frag) =>
      frag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      frag.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="codex" className="py-60 px-6 bg-void relative overflow-hidden velvet-section">
      <div className="atmosphere absolute inset-0 opacity-40 z-0" />
      
      <div className="max-w-[100rem] mx-auto relative z-10 flex flex-col gap-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
        
        {/* Left Column: Codex Editorial */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <div className="border-l-[1px] border-rosegold/30 pl-12 md:pl-20 relative">
            {/* Chapter Header */}
            <div className="flex items-center gap-6 mb-12">
               <span className="font-mono text-[10px] tracking-[0.5em] text-rosegold uppercase">Chapter 01 / Genesis</span>
               <span className="w-24 h-[1px] bg-gradient-to-r from-rosegold/40 to-transparent" />
            </div>

            <motion.h2 
              className="font-serif text-6xl md:text-9xl text-ivory leading-[0.8] mb-20 font-light tracking-tighter uppercase"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1.2 }}
            >
              The Master <br />
              <span className="text-ruby italic font-thin opacity-80">& The Ghost</span>
            </motion.h2>

            <div className="max-w-2xl space-y-16">
              <div className="relative">
                <span className="absolute -left-12 top-0 text-9xl text-ruby opacity-20 font-serif leading-none select-none italic">T</span>
                <p className="font-serif text-2xl md:text-3xl text-ivory/80 leading-relaxed font-light first-letter:text-5xl first-letter:text-gold first-letter:font-light first-letter:float-left first-letter:pr-4">
                  he Creator is the architect. He builds the vault, names the sovereign, and decides what the crown means. He brings command to the void.
                </p>
              </div>

              <p className="font-serif text-2xl md:text-3xl text-ivory/80 leading-relaxed font-light border-y border-rosegold/5 py-12 italic">
                The Create is the reality. The cost of the dream. The human underneath the persona who must carry the weight of the methodology. 
              </p>

              <button className="group mt-8 flex items-center gap-8 px-10 py-5 ruby-glass rounded-full border-rosegold/40 hover:border-gold/60 transition-all duration-700">
                <span className="font-sans text-[10px] tracking-[0.5em] text-ivory uppercase group-hover:text-gold">Initialize Read_</span>
                <div className="w-12 h-[1px] bg-gold/50 group-hover:w-20 transition-all duration-700" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Cinematic Media Object */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex items-center justify-center relative"
        >
          {/* Architecture Frame */}
          <div className="w-full relative aspect-[4/5] p-6 ruby-glass rounded-[40px] rotate-1 group hover:rotate-0 transition-transform duration-1000 shadow-2xl">
            <div className="absolute inset-6 border-[0.5px] border-rosegold/20 rounded-[30px]" />
            <div className="relative w-full h-full overflow-hidden rounded-[25px] mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000">
              <Image
                src={codexMedia}
                alt="Codex Media"
                fill
                className="object-cover contrast-[1.3] grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-velvet/80 via-transparent to-transparent opacity-90" />
              <div className="scanline" />
              
              <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-rosegold/10 pt-8">
                <div className="flex flex-col gap-1">
                   <span className="font-mono text-[7px] text-rosegold tracking-[0.5em] uppercase">Genesis_Segment</span>
                   <span className="font-mono text-[7px] text-ivory/20 tracking-[0.5em] uppercase">Auth: Approved</span>
                </div>
                <span className="font-serif text-5xl text-ivory/90 font-thin italic">01</span>
              </div>
            </div>
          </div>
          
          <div className="absolute -inset-10 border border-rosegold/5 rounded-full rotate-[-15deg] pointer-events-none" />
        </motion.div>
        </div>

        {/* Artifact Cards Grid */}
        <div className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="flex items-center gap-6 flex-grow">
              <span className="font-mono text-[9px] tracking-[0.5em] text-rosegold uppercase">Recovered_Fragments</span>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-rosegold/20 to-transparent max-w-sm" />
            </div>
            
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-ivory/40 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search archive..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-ivory/5 border border-rosegold/20 rounded-full text-ivory font-serif text-sm focus:outline-none focus:border-rosegold transition-colors pl-10 pr-4 py-2 placeholder:text-ivory/30 w-full md:w-64"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <AnimatePresence mode="popLayout">
               {filteredFragments.map((frag, idx) => (
                 <motion.div
                   key={frag.id}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.5 }}
                   layout
                 >
                   <ArtifactCard {...frag} delay={0} />
                 </motion.div>
               ))}
               {filteredFragments.length === 0 && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="col-span-1 md:col-span-3 py-20 text-center flex flex-col items-center gap-4"
                 >
                   <span className="font-mono text-xs tracking-widest text-ivory/30 uppercase">No fragments found</span>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}

