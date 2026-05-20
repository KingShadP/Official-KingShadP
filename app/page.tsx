"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Manifestations } from "@/components/Manifestations";
import { UniverseStats } from "@/components/UniverseStats";
import { LoreArchive } from "@/components/LoreArchive";
import { Oracle } from "@/components/Oracle";
import { Footer } from "@/components/Footer";
import { BootSequence } from "@/components/BootSequence";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const [isBooted, setIsBooted] = useState(false);

  return (
    <>
      <BootSequence onComplete={() => setIsBooted(true)} />
      
      <AnimatePresence>
        {isBooted && (
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="min-h-screen bg-void text-ivory font-sans selection:bg-gold selection:text-void overflow-x-hidden relative"
          >
            <div className="museum-grid fixed inset-0 z-[-2] opacity-[0.03] pointer-events-none" />
            <div className="atmosphere fixed inset-0 z-[-1] pointer-events-none" />
            
            <Nav />
            <div className="relative z-10">
              <Hero />
              <Manifestations />
              <LoreArchive />
              <UniverseStats />
              <Oracle />
              <Footer />
            </div>

            {/* Vertical Telemetry Rails */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 vertical-rail z-50 pointer-events-none hidden lg:flex items-center gap-6">
              <span className="font-mono text-[8px] text-rosegold/50 tracking-[0.4em] uppercase">AUTH.SIGNED_BY.KINGSHADP</span>
              <div className="w-[1px] h-24 bg-gradient-to-t from-rosegold/20 to-transparent" />
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
