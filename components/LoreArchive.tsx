"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ArtifactCard } from "@/components/ArtifactCard";
import { Search, X } from "lucide-react";

const codexMedia = "/ChatGPT Image May 16, 2026, 03_55_36 AM (2).png";

const loreFragments = [
  {
    id: "ARCHIVE_001",
    classification: "Foundational",
    title: "The First Crown",
    content: "We fashioned a sovereign not out of gold, but out of expectation. The weight was immediate. It was never meant to be comfortable."
  },
  {
    id: "ARCHIVE_002",
    classification: "Architect's Note",
    title: "Symmetry of the Void",
    content: "If the mirror reflects the ghost, then who is the master giving the command? The archive holds the silence between those two questions."
  },
  {
    id: "ARCHIVE_003",
    classification: "Encrypted Protocol",
    title: "The Final Seal",
    content: "Authorization denied to those without the mark. The vault opens only when the myth recognizes the blood of its creator."
  }
];

export function LoreArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const filteredFragments = loreFragments.filter(
    (frag) =>
      frag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      frag.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="codex" className="py-40 px-6 lg:px-12 bg-void relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-ivory/[0.015] blur-[100px] pointer-events-none rounded-full" />
      
      <div className="max-w-[100rem] mx-auto relative z-10 flex flex-col gap-40">
        
        {/* Editorial Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center relative aspect-[3/4] w-full group overflow-hidden"
          >
            <div className="relative w-full h-full overflow-hidden filter grayscale-[0.9] contrast-[1.2] group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-[2s]">
              <Image
                src={codexMedia}
                alt="Codex Media"
                fill
                className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[2.5s] ease-[0.16,1,0.3,1]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-void/10 mix-blend-multiply" />
            </div>
            
            {/* Ambient inner shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(5,5,5,0.8)] pointer-events-none" />

            {/* Minimal overlays */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-10">
               <span className="font-mono text-[8px] text-ivory tracking-[0.5em] uppercase mix-blend-difference drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Exhibit_A</span>
               <span className="font-mono text-[8px] text-ivory/50 tracking-[0.5em] uppercase mix-blend-difference">Auth_Level_00</span>
            </div>
            {/* Scanline overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)] mix-blend-overlay" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pl-0 lg:pl-12 flex flex-col gap-12">
              <div className="flex items-center gap-6">
                 <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/50 uppercase flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-ivory/50 animate-pulse" /> Manifesto / 01
                 </span>
                 <span className="w-16 h-[1px] bg-ivory/20" />
              </div>

              <h2 className="font-serif text-6xl md:text-8xl text-ivory leading-[0.8] font-light tracking-tighter uppercase relative group">
                The Master <br />
                <span className="italic opacity-60 relative pr-4 group-hover:opacity-100 transition-opacity duration-1000">
                  & The Ghost
                  <motion.div 
                    initial={{ scaleX: 0 }} 
                    whileInView={{ scaleX: 1 }} 
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5, ease: [0.16,1,0.3,1] }}
                    className="absolute top-1/2 left-0 w-full h-[1px] bg-ivory/30 origin-left" 
                  />
                </span>
              </h2>

              <div className="max-w-xl space-y-8 relative">
                {/* Visual accent vertical line */}
                <div className="absolute -left-12 top-0 w-[1px] h-full bg-gradient-to-b from-ivory/30 to-transparent hidden lg:block" />

                <p className="font-serif text-2xl md:text-3xl text-ivory/80 leading-relaxed font-light">
                  The Creator is the architect. He builds the vault, names the sovereign, and decides what the crown means. He brings command to the void.
                </p>
                <p className="font-sans text-sm md:text-base text-ivory/40 leading-relaxed font-light">
                  The Create is the reality. The cost of the dream. The human underneath the persona who must carry the weight of the methodology. 
                </p>

                <button 
                  onClick={() => setIsReaderOpen(true)}
                  className="group/btn mt-12 flex items-center gap-6 relative overflow-hidden py-2"
                >
                  <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/60 uppercase group-hover/btn:text-ivory transition-colors duration-500">Read Terminal</span>
                  <div className="w-12 h-[1px] bg-ivory/30 group-hover/btn:bg-ivory group-hover/btn:w-32 transition-all duration-700 ease-[0.16,1,0.3,1] relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-ivory opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 shadow-[0_0_8px_#fff]" />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Artifact Grid Header */}
        <div className="flex flex-col gap-12 border-t border-ivory/15 pt-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-ivory to-transparent opacity-20" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative z-10">
            <div>
              <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/50 uppercase block mb-4 flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-ivory/50" /> Database_Connection
              </span>
              <h3 className="font-serif text-4xl md:text-5xl text-ivory font-light italic drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">The Archives</h3>
            </div>
            
            <div className="relative group w-full md:w-auto">
              <Search className="w-4 h-4 text-ivory/30 absolute left-0 bottom-3 group-focus-within:text-ivory transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-b border-ivory/20 text-ivory font-serif text-xl focus:outline-none focus:border-ivory transition-colors pl-8 pr-4 py-2 placeholder:text-ivory/20 w-full md:w-64"
              />
              <div className="absolute bottom-0 left-0 w-0 h-px bg-ivory transition-all duration-500 ease-[0.16,1,0.3,1] group-focus-within:w-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-ivory/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-void relative">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_100%)] pointer-events-none opacity-80 z-10" />
             <AnimatePresence mode="popLayout">
               {filteredFragments.map((frag, idx) => (
                 <motion.div
                   key={frag.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   transition={{ duration: 0.8, delay: idx * 0.05 }}
                   layout
                   className="border-r border-b border-ivory/10 last:border-r-0 lg:[&:nth-child(3n)]:border-r-0 hover:bg-ivory/[0.015] transition-colors duration-500 relative z-20"
                 >
                   <ArtifactCard {...frag} delay={idx * 0.1} />
                 </motion.div>
               ))}
               {filteredFragments.length === 0 && (
                 <div className="col-span-full py-32 text-center flex flex-col items-center justify-center relative z-20">
                   <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="font-mono text-[9px] tracking-[0.5em] text-ivory/30 uppercase animate-pulse"
                   >
                     0_Records_Found
                   </motion.div>
                 </div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {isReaderOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-void/95 backdrop-blur-xl flex flex-col items-center justify-start p-0 overflow-hidden"
          >
            {/* Modal scanlines / cinematic overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)] mix-blend-overlay opacity-[0.03]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] pointer-events-none opacity-80" />

            <div className="absolute inset-0 overflow-y-auto px-6 py-24 md:px-12 flex flex-col items-center">
               <button 
                  onClick={() => setIsReaderOpen(false)}
                  className="fixed top-12 right-12 z-50 text-ivory/40 hover:text-ivory transition-colors flex gap-4 items-center font-mono text-[9px] tracking-[0.4em] uppercase group"
                >
                  <span className="group-hover:-translate-x-2 transition-transform duration-500">Close</span>
                  <div className="w-10 h-10 border border-ivory/20 flex items-center justify-center rounded-full group-hover:border-ivory transition-colors duration-500">
                    <X className="w-4 h-4" />
                  </div>
                </button>

                <div className="w-full max-w-3xl flex flex-col gap-12 mt-12 relative z-10">
                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 1, delay: 0.2 }}
                     className="pb-16 border-b border-ivory/15 relative"
                   >
                      <div className="absolute bottom-0 left-0 w-1/4 h-[1px] bg-gradient-to-r from-ivory to-transparent" />
                      <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/50 uppercase mb-8 block flex items-center gap-3">
                        <div className="w-2 h-2 bg-ivory animate-pulse" /> Manifesto_01 // SECURE
                      </span>
                      <h3 className="font-serif text-6xl md:text-8xl text-ivory font-light uppercase tracking-tighter leading-[0.85] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        The Master <br/><span className="text-ivory/60 italic">& The Ghost</span>
                      </h3>
                   </motion.div>

                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 1, delay: 0.4 }}
                     className="prose prose-invert max-w-none text-left space-y-12"
                   >
                       <p className="font-serif text-3xl md:text-4xl text-ivory/90 leading-relaxed font-light italic">
                         In the beginning, before the vault was constructed and before the crown was named, there was only the void. 
                       </p>
                       <p className="font-sans text-lg text-ivory/70 font-light leading-relaxed">
                         We fashioned a mythology because the truth was too fragile to sustain the weight of their gaze. The Master became the face—the projected ideal, the uncompromising standard, the golden idol bathed in champagne light. But every statue casts a shadow. 
                       </p>
                       <p className="font-sans text-lg text-ivory/70 font-light leading-relaxed">
                         The Create is the reality. It is the cost of the dream. To maintain the structural integrity of the myth, the human underneath must perform an endless act of architectural preservation. When the Master speaks, it is the Ghost who bleeds to provide the words. 
                       </p>
                       
                       <div className="py-16 flex justify-center w-full">
                          <div className="w-px h-32 bg-gradient-to-b from-transparent via-ivory/30 to-transparent" />
                       </div>
                       
                       <p className="font-serif text-2xl text-ivory/90 font-light leading-relaxed text-center italic drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                         The first crown was never meant to be comfortable. It was forged as a mechanism of control, a brilliant cage. And yet, we wear it.
                       </p>
                   </motion.div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

