"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import React, { useRef } from "react";

const artifacts = [
  {
    id: "EX_001",
    title: "Heavyweight Obsidian",
    classification: "Textile Architecture",
    origin: "The Core Series",
    image: "/ChatGPT Image May 16, 2026, 03_55_36 AM (1).png"
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

function ArtifactCard({ artifact, idx }: { artifact: any; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      key={artifact.id}
      initial={{ opacity: 0, filter: "grayscale(100%) blur(10px)" }}
      whileInView={{ opacity: 1, filter: "grayscale(0%) blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border-b lg:border-b-0 lg:border-r border-ivory/10 last:border-r-0 last:border-b-0"
      style={{ perspective: "1200px" }}
    >
      <motion.div 
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="p-12 md:p-16 flex flex-col h-full bg-void hover:bg-ivory/[0.02] transition-colors duration-1000 cursor-crosshair relative z-20"
      >
        {/* Dynamic Glare Effect */}
        <motion.div 
          className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)`,
            left: glareX,
            top: glareY,
            transform: 'translate(-50%, -50%)',
            width: '200%',
            height: '200%'
          }}
        />

        {/* Media Exhibit */}
        <div className="relative aspect-[3/4] w-full overflow-hidden mb-16 shadow-[0_30px_60px_rgba(0,0,0,0.8)] filter grayscale-[0.8] contrast-125 group-hover:grayscale-0 transition-all duration-1000" style={{ transform: 'translateZ(40px)' }}>
          <Image
            src={artifact.image}
            alt={artifact.title}
            fill
            className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-[0.16,1,0.3,1]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-void/10 mix-blend-multiply" />
          
          {/* Internal Scanline overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />
        </div>

        {/* Museum Plaque */}
        <div className="mt-auto space-y-8" style={{ transform: 'translateZ(20px)' }}>
          <div>
            <span className="font-mono text-[9px] text-ivory/30 tracking-[0.5em] uppercase mb-4 block">Ref: {artifact.id}</span>
            <h3 className="font-serif text-4xl text-ivory font-light italic leading-none group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-500">
              {artifact.title}
            </h3>
          </div>
          
          <div className="w-full h-px bg-ivory/10 group-hover:bg-ivory/40 transition-all duration-1000 group-hover:w-2/3 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          
          <div className="grid grid-cols-2 gap-4 text-[9px] font-mono tracking-[0.3em] uppercase text-ivory/40">
            <div className="flex flex-col gap-1">
              <span className="opacity-40">Class</span>
              <span className="group-hover:text-ivory transition-colors duration-500">{artifact.classification}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="opacity-40">Origin</span>
              <span className="group-hover:text-ivory transition-colors duration-500">{artifact.origin}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Manifestations() {
  return (
    <section id="relics" className="py-48 px-6 lg:px-12 bg-void relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ivory opacity-[0.02] blur-[150px] pointer-events-none mix-blend-screen rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white opacity-[0.02] blur-[120px] pointer-events-none mix-blend-screen rounded-full" />

      <div className="max-w-[100rem] mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row items-end justify-between mb-32 border-b border-ivory/15 pb-20 relative">
          <div className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-ivory to-transparent scale-x-0 origin-left animate-[scale-x_2s_ease-out_forwards]" style={{ animationDelay: '1s' }} />
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-ivory/50 mb-8 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-ivory/30 block" /> Manifestation_Library
            </span>
            <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl text-ivory leading-[0.8] tracking-tighter uppercase font-light drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
               Physical <br /><span className="italic opacity-80 relative pr-4">Manifestations</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block text-right mb-4"
          >
             <p className="font-serif italic text-2xl text-ivory/40 max-w-sm leading-relaxed">
                &ldquo;Every artifact secured in the central armory is a chapter of the myth made flesh.&rdquo;
             </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-ivory/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-void relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_100%)] pointer-events-none opacity-80 z-10" />
          {artifacts.map((artifact, idx) => (
            <ArtifactCard key={artifact.id} artifact={artifact} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}


