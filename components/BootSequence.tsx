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
            setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center p-8 overflow-hidden"
        >
          <div className="relative w-full max-w-[200px] flex flex-col items-center">
            
            <div className="overflow-hidden mb-6">
              <motion.span 
                 initial={{ y: "100%" }}
                 animate={{ y: "0%" }}
                 transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 className="font-mono text-[9px] text-ivory/50 tracking-[0.4em] uppercase"
              >
                  Initializing
              </motion.span>
            </div>
            
            <div className="w-full h-[1px] bg-ivory/10 relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-ivory"
                initial={{ width: "0%" }}
                animate={{ width: `${percent}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
