"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ScrollParticleBurst } from "@/components/ScrollParticleBurst";

export const TheVerse = memo(function TheVerse() {
  const shouldReduceMotion = useReducedMotion();
  const yOffset = (val: number) => shouldReduceMotion ? 0 : val;

  return (
    <section id="the-verse" className="relative w-full py-32 px-6 lg:px-24 z-10 border-t border-ivory/10 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-32">
        
        {/* Primary Artifacts */}
        <motion.div
          initial={{ opacity: 0, y: yOffset(20) }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="flex-1">
              <h2 className="font-serif text-5xl lg:text-6xl text-ivory font-light mb-8">
                Primary Artifacts<span className="text-gold">.</span>
              </h2>
            </div>
            <div className="flex-1 flex flex-col gap-8 font-mono text-sm tracking-[0.2em] uppercase text-ivory/80">
              <div className="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all cursor-crosshair">
                <span className="text-oxblood">01 //</span> The Silent Protocol
              </div>
              <div className="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all cursor-crosshair">
                <span className="text-oxblood">02 //</span> Vision Architect
              </div>
              <div className="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all cursor-crosshair">
                <span className="text-oxblood">03 //</span> Echo Directive
              </div>
              <div className="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all cursor-crosshair">
                <span className="text-oxblood">04 //</span> Final Command
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decrypted Directory / The Sonic Vault */}
        <motion.div
          initial={{ opacity: 0, y: yOffset(20) }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="border-t border-ivory/10 pt-16"
        >
          <p className="font-mono text-[10px] text-ivory/40 tracking-[0.3em] uppercase mb-4">Decrypted Directory</p>
          <h2 className="font-serif text-5xl lg:text-7xl text-ivory font-light mb-12">
            The Sonic Vault
          </h2>
          <div className="bg-ivory/5 border border-ivory/10 p-8 flex flex-col gap-4 relative overflow-hidden group hover:border-gold/30 transition-colors">
            <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none" />
            <h4 className="font-serif text-2xl text-ivory font-light group-hover:text-gold transition-colors z-10 relative">Signature Details Vol. 1</h4>
            <p className="font-mono text-xs text-ivory/60 tracking-[0.1em] uppercase z-10 relative">
              {"//"} High-Fidelity Audio Fragments extracted from the central archive.
            </p>
          </div>
        </motion.div>

        {/* Cinema Vault */}
        <motion.div
          initial={{ opacity: 0, y: yOffset(20) }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="border-t border-ivory/10 pt-16"
        >
          <p className="font-mono text-[10px] text-ivory/40 tracking-[0.3em] uppercase mb-4">Class: OMEGA</p>
          <h2 className="font-serif text-5xl lg:text-7xl text-ivory font-light mb-12">
            Cinema Vault
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="aspect-[16/9] border border-ivory/10 relative group cursor-crosshair overflow-hidden">
                <img src="/Front, Black (1)-1.png" alt="Artifact" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-20 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center transition-all">
                  <h4 className="font-serif text-2xl text-ivory font-light italic">The Platinum Standard</h4>
                </div>
             </div>
             <div className="aspect-[16/9] border border-ivory/10 relative group cursor-crosshair overflow-hidden">
                <img src="/unisex-organic-mid-light-crafter-t-shirt-desert-dust-front-6a16dd454c251.jpg" alt="Artifact" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-20 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center transition-all">
                  <h4 className="font-serif text-2xl text-ivory font-light italic">Ruby Reflections</h4>
                </div>
             </div>
             <div className="aspect-[16/9] border border-ivory/10 relative group cursor-crosshair overflow-hidden">
                <img src="/unisex-columbia-soft-shell-jacket-collegiate-navy-front-6a16eba5ad374.jpg" alt="Artifact" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-20 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center transition-all">
                  <h4 className="font-serif text-2xl text-ivory font-light italic">Crown Presence</h4>
                </div>
             </div>
             <div className="aspect-[16/9] border border-ivory/10 relative group cursor-crosshair overflow-hidden">
                <img src="/unisex-organic-mid-light-crafter-t-shirt-black-back-6a16dd454caca.jpg" alt="Artifact" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-20 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center transition-all">
                  <h4 className="font-serif text-2xl text-ivory font-light italic">Echoes of Gold</h4>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Visual Vault */}
        <ScrollParticleBurst />
        <motion.div
          initial={{ opacity: 0, y: yOffset(20) }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="border-t border-ivory/10 pt-16"
        >
          <p className="font-mono text-[10px] text-ivory/40 tracking-[0.3em] uppercase mb-4">The Crafted Archive of World & Presence</p>
          <h2 className="font-serif text-5xl lg:text-7xl text-ivory font-light mb-12">
            Visual Vault
          </h2>
          <div className="relative w-full pb-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative items-start">
              {/* Broken Grid Items */}
              <motion.div 
                className="md:col-span-5 md:col-start-1 relative z-10"
                initial={{ opacity: 0, y: yOffset(40) }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="aspect-[3/4] border border-ivory/10 relative overflow-hidden bg-ivory/5 group">
                  <img src="/ChatGPT Image May 28, 2026, 02_10_07 AM (5).png" alt="Artifact" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-60" />
                </div>
                <div className="mt-6 md:-mt-12 md:pl-8 relative z-20 mix-blend-difference">
                  <h4 className="font-serif text-3xl md:text-5xl text-ivory italic">The Crowned Standard</h4>
                  <p className="font-mono text-[10px] text-ivory/60 tracking-[0.2em] uppercase mt-2">Legacy / Artifact 01</p>
                </div>
              </motion.div>

              <motion.div 
                className="md:col-span-5 md:col-start-8 mt-16 md:mt-48 relative z-0"
                initial={{ opacity: 0, y: yOffset(80) }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="aspect-[4/3] border border-ivory/10 relative overflow-hidden bg-ivory/5 group">
                  <img src="/ChatGPT Image May 28, 2026, 02_10_07 AM (6)-1.png" alt="Artifact" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="mt-6">
                  <h4 className="font-serif text-2xl text-ivory">Crafted Silence</h4>
                  <p className="font-mono text-[10px] text-ivory/50 tracking-[0.2em] uppercase mt-1">Vision / Artifact 02</p>
                </div>
              </motion.div>

              <motion.div 
                className="md:col-span-6 md:col-start-4 mt-16 md:-mt-24 relative z-20"
                initial={{ opacity: 0, y: yOffset(60) }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <div className="aspect-[16/9] border border-ivory/10 relative overflow-hidden bg-ivory/5 group">
                  <img src="/ChatGPT Image May 28, 2026, 02_10_36 AM (1)-1.png" alt="Artifact" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="mt-6 bg-void/80 backdrop-blur-sm p-6 border border-ivory/5 -ml-4 md:-ml-8 mr-4 md:mr-0 inline-block shadow-2xl">
                  <h4 className="font-serif text-2xl text-ivory font-light italic">Private Command</h4>
                  <p className="font-mono text-[10px] text-ivory/50 tracking-[0.2em] uppercase mt-1">Motion / Artifact 03</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="md:col-span-4 md:col-start-9 mt-16 md:mt-32 relative z-10"
                initial={{ opacity: 0, y: yOffset(100) }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <div className="aspect-square border border-ivory/10 relative overflow-hidden bg-ivory/5 group">
                  <img src="/ChatGPT Image May 28, 2026, 02_11_23 AM (1).png" alt="Artifact" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="mt-6 text-right md:pr-8 md:-mt-12 relative z-20 mix-blend-difference">
                  <h4 className="font-serif text-2xl text-ivory">Archive Presence</h4>
                  <p className="font-mono text-[10px] text-ivory/50 tracking-[0.2em] uppercase mt-1">Myth / Artifact 04</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* The Official Intelligence */}
        <div className="border-t border-ivory/10 pt-16 mt-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: yOffset(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-serif text-5xl lg:text-7xl text-ivory font-light mb-8">
              TheOfficialIntelligence<span className="text-gold">.</span>
            </h2>
            <div className="font-serif text-lg md:text-xl text-ivory/80 leading-relaxed font-light space-y-6">
              <p>
                The Verse begins as a name, but the name is only the surface. Beneath it is a system of identity, taste, self-invention, contradiction, confidence, pain, performance, discipline, symbolism, and transformation.
              </p>
              <p>
                The world of KingShadP is luxurious, but luxury alone is too common. Luxury without meaning becomes costume. Power without restraint becomes noise. Confidence without emotional intelligence becomes arrogance. Mythology without truth becomes fantasy that collapses under its own decoration.
              </p>
              <p>
                The Official Intelligence exists to prevent that collapse. It gives the crown a brain, the dragon a purpose, the sound a body, the visuals a hierarchy, and the human a way to survive inside the persona.
              </p>
              <p>
                This is KingShadP not as a passing idea, but as architecture. This is the crown with a conscience.
              </p>
            </div>
          </motion.div>

          {/* The Creator and The Create */}
          <motion.div
            initial={{ opacity: 0, y: yOffset(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-24"
          >
            <h3 className="font-serif text-3xl lg:text-4xl text-ivory font-light mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-gold"></span>
              The Creator and The Create
            </h3>
            <div className="font-serif text-base md:text-lg text-ivory/70 leading-relaxed font-light space-y-6">
              <p>
                At the center of KingShadP lives a split: The Creator // The Create. This is not just a clever phrase. It is the psychological engine of the entire world.
              </p>
              <p>
                The Creator is the architect. He is the part of the self that chooses the name, designs the symbols, imagines the room, writes the line, edits the image, builds the website, selects the palette, shapes the sound, and decides how the world should feel.
              </p>
              <p>
                The Create is the result. He is what happens after the dream takes form. He is the human who must live inside the persona. He experiences the weight of being seen, the pressure of consistency...
              </p>
              <p>
                The Creator made the myth. The Create survived it. KingShadP is what happens when both refuse to disappear.
              </p>
            </div>
          </motion.div>

          {/* The Ruler Code */}
          <ScrollParticleBurst />
          <motion.div
            initial={{ opacity: 0, y: yOffset(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-24"
          >
            <h3 className="font-serif text-3xl lg:text-4xl text-ivory font-light mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-oxblood"></span>
              The Ruler Code
            </h3>
            <div className="font-serif text-base md:text-lg text-ivory/70 leading-relaxed font-light space-y-6">
              <p>
                The Ruler is the dominant archetype of KingShadP, but the Ruler must be understood correctly. This is not a cartoon king. This is not costume royalty.
              </p>
              <p>
                The Ruler code begins with hierarchy. Everything in the world of KingShadP needs rank. The crest carries recognition and house authority. The wordmark carries official naming.
              </p>
              <p>
                A true Ruler does not beg. Begging energy weakens the brand faster than imperfection does. The Ruler code says: do the work, define the standard, and let recognition grow from consistency.
              </p>
              <p>
                Own the room. Do not overcrowd it. Let every object know its rank. Let every silence have weight. Let the standard speak before the mouth does.
              </p>
            </div>
          </motion.div>

          {/* The Luxury of Silence */}
          <motion.div
            initial={{ opacity: 0, y: yOffset(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-24"
          >
            <h3 className="font-serif text-3xl lg:text-4xl text-ivory font-light mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-ivory/50"></span>
              The Luxury of Silence
            </h3>
            <div className="font-serif text-base md:text-lg text-ivory/70 leading-relaxed font-light space-y-6">
              <p>
                Taste is not the ability to add expensive-looking things. Taste is the ability to know what not to add. The risk is not emptiness. The risk is excess without hierarchy.
              </p>
              <p>
                Restraint is what turns luxury from decoration into atmosphere. A room with every symbol displayed at once feels insecure. A room with one correct symbol in the right place feels controlled.
              </p>
              <p>
                The luxury of silence is that it lets the audience lean in. When everything is obvious, the audience consumes and leaves. When something is withheld, they interpret. They search. They remember.
              </p>
              <p>
                Taste is the discipline of choosing. Restraint is the confidence to stop.
              </p>
            </div>
          </motion.div>
          
          {/* Protocols */}
          <motion.div
            initial={{ opacity: 0, y: yOffset(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-24 pt-16 border-t border-ivory/10 pb-16"
          >
            <h3 className="font-serif text-3xl lg:text-4xl text-ivory font-light mb-8">
              Protocols
            </h3>
            <div className="flex flex-col gap-4 font-mono text-sm tracking-[0.2em] uppercase text-ivory/80">
              <a href="#" className="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all">
                <span className="text-oxblood">01 /</span> Summit_Core
              </a>
              <a href="#" className="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all">
                <span className="text-oxblood">02 /</span> Mirror_Feeds
              </a>
              <a href="#" className="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all">
                <span className="text-oxblood">03 /</span> Neural_Archive
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
});
