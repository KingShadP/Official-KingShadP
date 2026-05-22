"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Manifestations } from "@/components/Manifestations";
import { UniverseStats } from "@/components/UniverseStats";
import { LoreArchive } from "@/components/LoreArchive";
import { CelestialNavigation } from "@/components/CelestialNavigation";
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
            className="min-h-screen bg-void text-ivory font-sans selection:bg-ivory selection:text-void overflow-x-hidden relative"
          >
            <div className="atmosphere fixed inset-0 z-[-1] pointer-events-none" />
            
            <Nav />
            <div className="relative z-10">
              <Hero />
              <Manifestations />
              <LoreArchive />
              <CelestialNavigation />
              <UniverseStats />
              <Oracle />
              <Footer />
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
