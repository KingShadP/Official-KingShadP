"use client";

import { motion } from "motion/react";
import Image from "next/image";

const artifacts = [
  {
    id: "EX_001",
    title: "Heavyweight Obsidian",
    classification: "Textile Architecture",
    origin: "The Core Series",
    image: "/ChatGPT Image May 16, 2026, 03_55_36 AM (1).png" // using available path
  },
  {
    id: "EX_002",
    title: "Giragon Sigil",
    classification: "Precious Metalwork",
    origin: "Authorization Level 0",
    image: "/ChatGPT Image May 16, 2026, 03_55_36 AM (3).png",
  },
  {
    id: "EX_003",
    title: "Regal Echoes",
    classification: "Sonic Preservation",
    origin: "Analog Vault Vol I",
    image: "/ChatGPT Image May 16, 2026, 03_55_36 AM (2).png",
  },
];

export function Manifestations() {
  return (
    <section id="relics" className="py-48 px-6 lg:px-12 bg-void relative overflow-hidden">
      <div className="max-w-[100rem] mx-auto">
        
        <div className="flex flex-col lg:flex-row items-end justify-between mb-32 border-b border-ivory/10 pb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-ivory/50 mb-8 block">Manifestation_Library</span>
            <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl text-ivory leading-[0.8] tracking-tighter uppercase font-light">
               Physical <br /><span className="italic opacity-50 relative pr-4">Manifestations</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="hidden lg:block text-right mb-4"
          >
             <p className="font-serif italic text-2xl text-ivory/40 max-w-sm leading-relaxed">
                &ldquo;Every artifact secured in the central armory is a chapter of the myth made flesh.&rdquo;
             </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-ivory/10">
          {artifacts.map((artifact, idx) => (
            <motion.div
              key={artifact.id}
              initial={{ opacity: 0, filter: "grayscale(100%) blur(4px)" }}
              whileInView={{ opacity: 1, filter: "grayscale(100%) blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="group border-b lg:border-b-0 lg:border-r border-ivory/10 last:border-r-0 last:border-b-0"
            >
              <div className="p-12 md:p-16 flex flex-col h-full bg-void hover:bg-ivory/[0.02] transition-colors duration-1000">
                {/* Media Exhibit */}
                <div className="relative aspect-[3/4] w-full overflow-hidden mb-16 filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-1000">
                  <Image
                    src={artifact.image}
                    alt={artifact.title}
                    fill
                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-[0.16,1,0.3,1]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-void/10 mix-blend-multiply" />
                </div>

                {/* Museum Plaque */}
                <div className="mt-auto space-y-8">
                  <div>
                    <span className="font-mono text-[9px] text-ivory/30 tracking-[0.5em] uppercase mb-4 block">Ref: {artifact.id}</span>
                    <h3 className="font-serif text-4xl text-ivory font-light italic leading-none group-hover:opacity-80 transition-opacity duration-500">
                      {artifact.title}
                    </h3>
                  </div>
                  
                  <div className="w-full h-px bg-ivory/10 group-hover:bg-ivory/30 transition-all duration-1000 group-hover:w-1/2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-[9px] font-mono tracking-[0.3em] uppercase text-ivory/40">
                    <div className="flex flex-col gap-1">
                      <span className="opacity-40">Class</span>
                      <span>{artifact.classification}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="opacity-40">Origin</span>
                      <span>{artifact.origin}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


