"use client";
import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "The black marble alignment has settled. Platinum rays now pierce the absolute void.",
  "Under the Oxblood eclipse, the corporate-spiritual ledgers remain perfectly locked.",
  "Scepter vectors synchronized. The Gold standard has been recalibrated.",
  "The silent lion stirs. Cosmic coordinates are aligning to absolute perfection.",
  "Gold fire sparks descend. The treasury of the sovereign king remains untouched."
];

interface MessageState {
  id: string;
  text: string;
}

export const CelestialEventToast = memo(function CelestialEventToast() {
  const [activeMsg, setActiveMsg] = useState<MessageState | null>(null);

  useEffect(() => {
    const trigger = () => {
      const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setActiveMsg({
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        text
      });

      setTimeout(() => setActiveMsg(null), 8000);
      
      const nextDelay = Math.floor(Math.random() * 25000) + 15000;
      setTimeout(trigger, nextDelay);
    };

    const firstTimer = setTimeout(trigger, 12000);
    return () => clearTimeout(firstTimer);
  }, []);

  return (
    <AnimatePresence>
      {activeMsg && (
        <motion.div
          initial={{ opacity: 0, x: 150, skewX: -20, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, skewX: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: 100, scale: 0.9, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-24 right-6 lg:bottom-32 lg:right-10 z-[150] w-[280px] sm:w-[320px] bg-void border border-oxblood shadow-[0_0_40px_rgba(147,0,10,0.3)] p-6 pointer-events-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="flex justify-between items-center border-b border-ivory/20 pb-2 mb-4 relative z-10">
             <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-gold animate-pulse drop-shadow-[0_0_5px_rgba(220,197,123,0.8)]">Transmission // {activeMsg.id}</span>
          </div>
          <p className="font-serif italic text-sm text-ivory leading-relaxed relative z-10 drop-shadow-md">&ldquo;{activeMsg.text}&rdquo;</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
