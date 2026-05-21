"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ArtifactCard } from "@/components/ArtifactCard";
import { Search, X } from "lucide-react";

const codexMedia = "/regenerated_image_1779241202319.png";

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
      <div className="max-w-[100rem] mx-auto relative z-10 flex flex-col gap-40">
        
        {/* Editorial Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center relative aspect-[3/4] w-full"
          >
            <div className="relative w-full h-full overflow-hidden filter grayscale contrast-125">
              <Image
                src={codexMedia}
                alt="Codex Media"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-void/20 mix-blend-multiply" />
            </div>
            {/* Minimal overlays */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-2">
               <span className="font-mono text-[8px] text-ivory tracking-[0.5em] uppercase mix-blend-difference">Exhibit_A</span>
               <span className="font-mono text-[8px] text-ivory/50 tracking-[0.5em] uppercase mix-blend-difference">Auth_Level_00</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pl-0 lg:pl-12 flex flex-col gap-12">
              <div className="flex items-center gap-6">
                 <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/50 uppercase">Manifesto / 01</span>
                 <span className="w-12 h-[1px] bg-ivory/20" />
              </div>

              <h2 className="font-serif text-6xl md:text-8xl text-ivory leading-[0.8] font-light tracking-tighter uppercase relative">
                The Master <br />
                <span className="italic opacity-50 relative pr-4">
                  & The Ghost
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-ivory/30" />
                </span>
              </h2>

              <div className="max-w-xl space-y-8">
                <p className="font-serif text-2xl md:text-3xl text-ivory/80 leading-relaxed font-light">
                  The Creator is the architect. He builds the vault, names the sovereign, and decides what the crown means. He brings command to the void.
                </p>
                <p className="font-sans text-sm md:text-base text-ivory/40 leading-relaxed font-light">
                  The Create is the reality. The cost of the dream. The human underneath the persona who must carry the weight of the methodology. 
                </p>

                <button 
                  onClick={() => setIsReaderOpen(true)}
                  className="group mt-12 flex items-center gap-6"
                >
                  <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/50 uppercase group-hover:text-ivory transition-colors">Read Terminal</span>
                  <div className="w-12 h-[1px] bg-ivory/20 group-hover:bg-ivory group-hover:w-24 transition-all duration-700 ease-[0.16,1,0.3,1]" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Artifact Grid Header */}
        <div className="flex flex-col gap-12 border-t border-ivory/10 pt-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div>
              <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/50 uppercase block mb-4">Database_Connection</span>
              <h3 className="font-serif text-4xl md:text-5xl text-ivory font-light italic">The Archives</h3>
            </div>
            
            <div className="relative group w-full md:w-auto">
              <Search className="w-4 h-4 text-ivory/30 absolute left-0 bottom-3" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-b border-ivory/20 text-ivory font-serif text-xl focus:outline-none focus:border-ivory transition-colors pl-8 pr-4 py-2 placeholder:text-ivory/20 w-full md:w-64"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-ivory/10">
             <AnimatePresence mode="popLayout">
               {filteredFragments.map((frag, idx) => (
                 <motion.div
                   key={frag.id}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.8 }}
                   layout
                   className="border-r border-b border-ivory/10 last:border-r-0 lg:[&:nth-child(3n)]:border-r-0"
                 >
                   <ArtifactCard {...frag} delay={idx * 0.1} />
                 </motion.div>
               ))}
               {filteredFragments.length === 0 && (
                 <div className="col-span-full py-32 text-center flex flex-col items-center justify-center">
                   <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/30 uppercase">0_Records_Found</span>
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
            className="fixed inset-0 z-[100] bg-void flex items-center justify-center p-0"
          >
            <div className="absolute inset-0 overflow-y-auto max-w-screen-xl mx-auto px-6 py-24 md:px-12 flex flex-col items-center">
               <button 
                  onClick={() => setIsReaderOpen(false)}
                  className="absolute top-12 right-12 text-ivory/40 hover:text-ivory transition-colors flex gap-4 items-center font-mono text-[9px] tracking-[0.4em] uppercase"
                >
                  Close <X className="w-5 h-5" />
                </button>

                <div className="w-full max-w-3xl flex flex-col gap-12 mt-12">
                   <div className="pb-12 border-b border-ivory/10">
                      <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/40 uppercase mb-8 block">Manifesto_01</span>
                      <h3 className="font-serif text-6xl md:text-8xl text-ivory font-light uppercase tracking-tighter leading-[0.85]">The Master <br/><span className="text-ivory/50 italic">& The Ghost</span></h3>
                   </div>

                   <div className="prose prose-invert max-w-none text-left space-y-8">
                       <p className="font-serif text-3xl md:text-4xl text-ivory/90 leading-relaxed font-light italic">
                         In the beginning, before the vault was constructed and before the crown was named, there was only the void. 
                       </p>
                       <p className="font-sans text-lg text-ivory/60 font-light leading-relaxed">
                         We fashioned a mythology because the truth was too fragile to sustain the weight of their gaze. The Master became the face—the projected ideal, the uncompromising standard, the golden idol bathed in champagne light. But every statue casts a shadow. 
                       </p>
                       <p className="font-sans text-lg text-ivory/60 font-light leading-relaxed">
                         The Create is the reality. It is the cost of the dream. To maintain the structural integrity of the myth, the human underneath must perform an endless act of architectural preservation. When the Master speaks, it is the Ghost who bleeds to provide the words. 
                       </p>
                       <div className="py-12 flex justify-center">
                          <div className="w-px h-24 bg-ivory/20" />
                       </div>
                       <p className="font-serif text-2xl text-ivory/80 font-light leading-relaxed text-center">
                         The first crown was never meant to be comfortable. It was forged as a mechanism of control, a brilliant cage. And yet, we wear it.
                       </p>
                   </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

