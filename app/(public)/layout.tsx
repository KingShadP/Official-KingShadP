"use client";

import React, { useState, useEffect } from "react";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { HUD } from "@/components/HUD";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VaultOS } from "@/components/VaultOS";
import { Bootloader } from "@/components/Bootloader";
import { ShadowConcierge } from "@/components/ShadowConcierge";
import { AnimatePresence, motion } from "framer-motion";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const booted = sessionStorage.getItem("kingshadp_booted");
      if (booted === "true") {
        setIsBooted(true);
      }
    }
  }, []);

  const handleBootComplete = () => {
    setIsBooted(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("kingshadp_booted", "true");
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isBooted && (
          <Bootloader key="bootloader" onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      {isBooted && (
        <div className="relative min-h-screen text-[#dcc57b] flex flex-col justify-between overflow-x-hidden font-sans">
          <ParallaxBackground />
          <HUD />
          <Nav />

          <div className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24 z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </div>

          <Footer />
          <VaultOS />
          <ShadowConcierge />
        </div>
      )}
    </>
  );
}
