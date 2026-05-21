"use client";

import { motion } from "motion/react";
import { Activity, ShieldCheck, Zap, Lock } from "lucide-react";

export function UniverseStats() {
  return (
    <section className="py-48 px-6 lg:px-12 bg-void relative border-t border-ivory/10 overflow-hidden">
      
      <div className="max-w-[100rem] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <div className="flex flex-col space-y-12">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-[1px] bg-ivory/20" />
                 <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-ivory/50">System_Diagnostics</span>
              </div>
              <h2 className="font-serif text-5xl md:text-7xl text-ivory font-light leading-none tracking-tighter uppercase">
                The Engine <br /> <span className="italic opacity-50 relative pr-4">Below The Mirror</span>
              </h2>
              <p className="font-sans text-lg text-ivory/40 leading-relaxed font-light border-l-[0.5px] border-ivory/10 pl-8">
                &ldquo;The vault does not just store artifacts; it generates the mythology required to sustain the dream.&rdquo;
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2 }}
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ivory/10 border border-ivory/10"
          >
            <StatBox icon={<Activity className="w-4 h-4"/>} label="Neural Convergence" value="098.4" unit="ms" subtext="Latency in myth synchronization." />
            <StatBox icon={<ShieldCheck className="w-4 h-4"/>} label="Vault Integrity" value="OMEGA" subtext="All sectors locked & cataloged." delay={0.2} />
            <StatBox icon={<Zap className="w-4 h-4"/>} label="Radiance Output" value="IV" unit="lvl" subtext="Light saturation optimal." delay={0.4} />
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
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-void p-12 lg:p-16 flex flex-col justify-between hover:bg-ivory/[0.02] transition-colors duration-1000 group relative"
    >
      <div className="absolute top-8 right-8 text-ivory/10 group-hover:text-ivory/30 transition-colors duration-700">
         {icon}
      </div>

      <div className="flex justify-between items-start mb-12">
        <span className="font-mono text-[9px] tracking-[0.5em] text-ivory/40 uppercase">{label}</span>
      </div>

      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-serif text-5xl md:text-7xl text-ivory font-light italic leading-none group-hover:opacity-80 transition-opacity duration-700">{value}</span>
        {unit && <span className="font-mono text-xs text-ivory/30">{unit}</span>}
      </div>

      <span className="font-sans text-xs text-ivory/40 leading-relaxed font-light">{subtext}</span>
    </motion.div>
  );
}

