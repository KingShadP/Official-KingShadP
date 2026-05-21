"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ArtifactCardProps {
  id: string;
  title: string;
  classification: string;
  content: string;
  delay?: number;
}

export function ArtifactCard({ id, title, classification, content, delay = 0 }: ArtifactCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer flex flex-col justify-between relative overflow-hidden bg-transparent border border-ivory/10 hover:border-ivory/40 transition-colors duration-700 p-8 h-full"
      >
        <div className="mb-10 pb-6 border-b border-ivory/10 group-hover:border-ivory/40 transition-colors duration-700">
           <span className="font-mono text-[9px] tracking-[0.4em] text-ivory/40 uppercase mb-4 block transition-colors group-hover:text-ivory/70">{classification}</span>
           <h4 className="font-serif text-3xl text-ivory/80 group-hover:text-ivory transition-colors duration-500 font-light leading-tight">{title}</h4>
        </div>

        <div className="flex-grow flex flex-col justify-center mb-10">
          <p className="font-serif text-lg text-ivory/50 leading-relaxed italic group-hover:text-ivory/80 transition-colors duration-500">
            &ldquo;{content}&rdquo;
          </p>
        </div>

        <div className="mt-auto flex justify-between items-end border-t border-ivory/10 pt-6 group-hover:border-ivory/40 transition-colors duration-700">
           <span className="font-mono text-[8px] text-ivory/30 tracking-[0.4em] uppercase">Ref:</span>
           <span className="font-mono text-[10px] text-ivory/60 tracking-[0.3em] uppercase">{id}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-void/90 backdrop-blur-3xl p-0"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full md:h-auto md:max-w-4xl bg-void border border-ivory/10 px-8 py-16 md:p-20 overflow-y-auto mix-blend-difference"
            >
              <div className="relative z-10 max-w-2xl mx-auto">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="fixed md:absolute top-8 right-8 text-ivory/40 hover:text-ivory transition-colors p-4 rounded-full flex gap-2 items-center uppercase font-mono text-[9px] tracking-[0.4em]"
                  aria-label="Close modal"
                >
                  Close <X className="w-4 h-4 ml-2" />
                </button>
                
                <div className="mb-16 border-b border-ivory/10 pb-12">
                  <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/50 uppercase mb-8 block">{classification}</span>
                  <h3 className="font-serif text-5xl md:text-6xl text-ivory font-light italic tracking-tight leading-[1]">{title}</h3>
                </div>
                
                <div className="prose prose-invert max-w-none text-left">
                  <p className="font-serif text-2xl md:text-3xl text-ivory/80 leading-relaxed font-light mb-12">
                    &ldquo;{content}&rdquo;
                  </p>
                  <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/50 font-light max-w-xl">
                    Detailed analysis reveals the depth of the {title.toLowerCase()}. Its architectural resonance echoes through the void, creating a lasting imprint on the mythological framework. The creator built the vault, but the artifact persists independently.
                  </p>
                </div>
                
                <div className="mt-20 pt-8 border-t border-ivory/10 flex justify-between items-center opacity-70">
                  <span className="font-mono text-[9px] text-ivory/40 tracking-[0.3em] uppercase">Status: Archived</span>
                  <span className="font-mono text-[10px] text-ivory/70 tracking-[0.4em] uppercase">{id}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
