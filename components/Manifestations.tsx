"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { TiltCard } from "@/components/TiltCard";
const artifact1Image = "/ChatGPT Image May 16, 2026, 03_55_36 AM (1).png";

const artifacts = [
  {
    id: "MET_001",
    title: "Heavyweight Obsidian",
    classification: "Textile Architecture",
    origin: "The Core Series",
    image: "/ChatGPT Image May 16, 2026, 03_55_36 AM (2).png"
  },
  {
    id: "MET_002",
    title: "Giragon Sigil",
    classification: "Precious Metalwork",
    origin: "Authorization Level 0",
    image: "/ChatGPT Image May 12, 2026, 02_51_09 PM (8).png",
  },
  {
    id: "MET_003",
    title: "Regal Echoes",
    classification: "Sonic Preservation",
    origin: "Analog Vault Vol I",
    image: "/ChatGPT Image May 16, 2026, 03_49_21 AM (1).png",
  },
];

export function Manifestations() {
  return (
    <section id="relics" className="py-48 bg-void relative overflow-hidden velvet-section">
      <div className="max-w-[100rem] mx-auto px-8">
        
        <div className="flex flex-col lg:flex-row items-end justify-between mb-32 border-b border-rosegold/10 pb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-rosegold mb-8 block">Manifestation_Library</span>
            <h2 className="font-serif text-6xl md:text-8xl text-ivory leading-none tracking-tighter uppercase font-light">
               Physical <br /><span className="italic text-ruby opacity-90 drop-shadow-lg">Manifestations</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="hidden lg:block text-right mb-4"
          >
             <p className="font-serif italic text-xl text-ivory/40 max-w-sm leading-relaxed">
                &ldquo;Every artifact secured in the central armory is a chapter of the myth made flesh.&rdquo;
             </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24 items-start">
          {artifacts.map((artifact, idx) => (
            <motion.div
              key={artifact.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`${idx === 1 ? 'md:mt-32' : ''} ${idx === 2 ? 'lg:mt-16' : ''}`}
            >
              <TiltCard className="group relative cursor-crosshair">
                {/* Media Exhibit */}
                <div className="relative aspect-[3/4] overflow-hidden ruby-glass p-2 transition-all duration-700 group-hover:border-rosegold/40">
                  <div className="relative w-full h-full overflow-hidden bg-void">
                    <Image
                      src={artifact.image}
                      alt={artifact.title}
                      fill
                      className="object-cover opacity-70 mix-blend-luminosity group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="scanline" />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-1000" />
                    
                    {/* Micro Metadata */}
                    <div className="absolute top-6 left-6 font-mono text-[7px] text-gold/40 tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      ID: {artifact.id} // SEC_LVL: 4
                    </div>
                  </div>
                </div>

                {/* Museum Plaque */}
                <div className="mt-10 space-y-4 px-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-3xl text-ivory group-hover:text-gold transition-colors duration-500 font-light italic">
                      {artifact.title}
                    </h3>
                    <span className="font-mono text-[8px] text-rosegold/50 tracking-widest">{artifact.id}</span>
                  </div>
                  <div className="w-full h-px bg-rosegold/10 group-hover:bg-rosegold/30 transition-all duration-700" />
                  <div className="flex justify-between items-center text-[9px] font-mono tracking-[0.2em] uppercase text-ivory/30">
                    <span>{artifact.classification}</span>
                    <span className="italic">{artifact.origin}</span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

