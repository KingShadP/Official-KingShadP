"use client";

import { motion } from "motion/react";

interface ArtifactCardProps {
  id: string;
  title: string;
  classification: string;
  content: string;
  delay?: number;
}

export function ArtifactCard({ id, title, classification, content, delay = 0 }: ArtifactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="artifact-card p-8 rounded-[24px] group cursor-crosshair flex flex-col justify-between"
    >
      {/* Subtle Shimmer Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rosegold/0 via-rosegold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none" />
      
      {/* OS Decor */}
      <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-100 transition-opacity duration-700">
        <div className="w-1.5 h-1.5 rounded-full bg-ruby animate-pulse" />
      </div>

      <div className="mb-10 border-b border-rosegold/10 pb-6 group-hover:border-rosegold/30 transition-colors duration-700 relative z-10">
         <span className="font-mono text-[9px] tracking-[0.4em] text-rosegold uppercase mb-3 block">{classification}</span>
         <h4 className="font-serif text-3xl text-ivory/90 group-hover:text-gold transition-colors duration-500 font-light engraved-text leading-tight">{title}</h4>
      </div>

      <div className="relative z-10 flex-grow flex flex-col justify-center mb-10">
        <p className="font-serif text-base text-ivory/60 leading-relaxed italic group-hover:text-ivory/90 transition-colors duration-500 engraved-text">
          &ldquo;{content}&rdquo;
        </p>
      </div>

      <div className="mt-auto flex justify-between items-end border-t border-rosegold/10 pt-6 group-hover:border-rosegold/30 transition-colors duration-700 relative z-10">
         <span className="font-mono text-[8px] text-ivory/30 tracking-[0.4em] uppercase">Fragment_ID:</span>
         <span className="font-mono text-[10px] text-rosegold/70 tracking-[0.3em] uppercase">{id}</span>
      </div>

      {/* Engraved Corners */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-[1.5px] border-l-[1.5px] border-rosegold/20 rounded-tl-sm group-hover:border-gold/50 transition-colors duration-700" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-[1.5px] border-r-[1.5px] border-rosegold/20 rounded-br-sm group-hover:border-gold/50 transition-colors duration-700" />
    </motion.div>
  );
}
