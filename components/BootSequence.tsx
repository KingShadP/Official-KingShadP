"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 1000);
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center p-8 overflow-hidden"
        >
          <div className="museum-grid absolute inset-0 opacity-10" />
          
          <div className="relative w-full max-w-sm">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="font-mono text-[8px] text-rosegold tracking-[0.4em] uppercase">System.Initialize</span>
                <span className="font-serif text-lg text-ivory/80 italic font-light">Divine Archive / v4.0</span>
              </div>
              <span className="font-mono text-[10px] text-rosegold">{percent}%</span>
            </div>
            
            <div className="w-full h-[1px] bg-rosegold/20 relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gold"
                initial={{ width: "0%" }}
                animate={{ width: `${percent}%` }}
              />
            </div>

            <div className="mt-8 space-y-1">
              {["AUTHENTICATING_USER", "DECRYPTING_VAULT_CORES", "SYNCHRONIZING_MYTH_STATE", "GIRAGON_SEAL_VERIFIED"].map((text, i) => (
                <div key={i} className="flex items-center gap-3 opacity-30">
                  <div className={`w-1 h-1 rounded-full ${percent > (i + 1) * 20 ? 'bg-gold' : 'bg-ivory/40'}`} />
                  <span className="font-mono text-[8px] tracking-widest uppercase">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-12 font-mono text-[7px] text-ivory/20 tracking-[0.5em] uppercase">
            &copy; KINGSHADP.INTEL // ALL RIGHTS RESERVED
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
