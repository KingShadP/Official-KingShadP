"use client";

import { motion } from "motion/react";
import { Activity, ShieldCheck, Zap, Lock } from "lucide-react";

export function UniverseStats() {
  return (
    <section className="py-48 bg-void relative border-y border-rosegold/5 overflow-hidden velvet-section">
      <div className="museum-grid absolute inset-0 opacity-[0.05]" />
      
      <div className="max-w-[100rem] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <div className="flex flex-col space-y-10">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-[1px] bg-rosegold/40" />
                 <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-rosegold">System_Diagnostics</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl text-ivory font-light leading-none tracking-tighter uppercase">
                The Engine <br /> <span className="italic text-ruby opacity-80">Below The Mirror</span>
              </h2>
              <p className="font-serif text-xl text-ivory/40 leading-relaxed font-light italic border-l border-rosegold/20 pl-8">
                &ldquo;The vault does not just store artifacts; it generates the mythology required to sustain the dream.&rdquo;
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2 }}
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative"
          >
            <StatBox icon={<Activity className="w-4 h-4"/>} label="Neural Convergence" value="098.4" unit="ms" subtext="Latency in myth synchronization." />
            <StatBox icon={<ShieldCheck className="w-4 h-4"/>} label="Vault Integrity" value="OMEGA" subtext="All sectors locked & cataloged." delay={0.2} />
            <StatBox icon={<Zap className="w-4 h-4"/>} label="Radiance Output" value="IV" unit="lvl" subtext="Champagne light saturation." delay={0.4} />
            <StatBox icon={<Lock className="w-4 h-4"/>} label="Authorization" value="KSP_0" subtext="Root access verified." delay={0.6} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatBox({ icon, label, value, unit, subtext, delay = 0 }: { icon: React.ReactNode, label: string, value: string, unit?: string, subtext: string, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="ruby-glass p-10 flex flex-col space-y-6 hover:bg-white/5 transition-all duration-1000 relative overflow-hidden group border-rosegold/10"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-ruby/10 to-transparent scale-0 group-hover:scale-125 transition-transform duration-1000 blur-2xl" />
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
         {icon}
      </div>

      <div className="flex justify-between items-start relative z-10">
        <span className="font-mono text-[8px] tracking-[0.5em] text-rosegold uppercase">{label}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-ruby/40 group-hover:bg-ruby animate-pulse" />
      </div>

      <div className="flex items-baseline gap-2 py-2 relative z-10">
        <span className="font-serif text-6xl text-ivory/90 group-hover:text-glow-rosegold transition-all duration-700">{value}</span>
        {unit && <span className="font-mono text-xs text-gold/40">{unit}</span>}
      </div>

      <span className="font-mono text-[9px] text-ivory/30 tracking-[0.3em] uppercase leading-relaxed relative z-10">{subtext}</span>
      
      {/* OS Corner accents */}
      <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-rosegold/20 group-hover:border-gold/40 transition-colors" />
    </motion.div>
  );
}

