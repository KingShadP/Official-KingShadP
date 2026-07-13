"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [percent, setPercent] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const initialLogLines = [
    "// SYS.LAUNCH: SEC_ORBIT_42 ACTIVE",
    "// CONNECTING TO REVERSED PROXY (PORT: 3000)...",
    "// DECRYPTING SYSTEM SOVEREIGN ACCESS CREDENTIALS...",
    "// COLD CHANNEL ESTABLISHED WITH GEMINI MODEL CORES...",
    "// VERIFYING AUTHORIZATION FOR ORBIT_MEMBER...",
    "// SYSTEM SIGNATURE: STAR_IVORY_MATTE_BLACK",
    "// INTEGRITY ANALYSIS: 99.82% OPTIMAL",
    "// PARSING 'THE CREATOR' // 'THE CREATE' SPLIT DOCKET...",
    "// CONFIDENCE ANCHOR DOCTRINE LOADED: YOU AIN'T BETTER THAN ME",
    "// STENCIL LOGO CRES_V2 ENGAGED (ZERO DOUBLE CROWNS)...",
    "// BOOT SEQUENCE OPTIMIZING GRAPHICAL DRIFT CHANNELS...",
  ];

  useEffect(() => {
    // Only run if not already booted in session
    const checkBoot = sessionStorage.getItem("kingshadp_booted");
    if (checkBoot === "true") {
      onComplete();
      return;
    }

    let progress = 0;
    let logIndex = 0;

    const interval = setInterval(() => {
      // Advance percentage
      progress += Math.floor(Math.random() * 52) + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem("kingshadp_booted", "true");
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 800);
        }, 600);
      }
      setPercent(progress);

      // Add corresponding logs
      if (logIndex < initialLogLines.length) {
        const linesToAdd = initialLogLines.slice(0, logIndex + 1);
        setLogs(linesToAdd);
        logIndex += Math.floor(Math.random() * 2) + 1;
      }
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="boot-sequence-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex items-center justify-center p-8 bg-noise"
        >
          <div className="max-w-2xl w-full flex flex-col gap-8 font-mono text-[10px] text-ivory/60">
            {/* Top Bar Header */}
            <div className="flex justify-between items-center border-b border-ivory/10 pb-4">
              <span className="text-gold tracking-[0.2em] font-semibold">
                [ KING_SHADP // ORBITAL_CORE ]
              </span>
              <span className="text-oxblood font-semibold">SYS_SEC_V3 // ON_AIR</span>
            </div>

            {/* Simulated Live Console */}
            <div className="min-h-[220px] flex flex-col gap-2 justify-end select-none">
              {logs.map((log, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono"
                >
                  {log}
                </motion.p>
              ))}
            </div>

            {/* Slider / Loading Matrix Meter */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex justify-between font-mono text-[9px] tracking-widest text-ivory/40">
                <span>SECTOR: ORBIT_CORE</span>
                <span>STATE_RESONANCE: {percent}%</span>
              </div>
              <div className="w-full h-[1px] bg-ivory/10 relative overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-gold"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Bottom status */}
            <div className="text-center text-ivory/20 uppercase tracking-[0.3em] text-[8px] mt-8">
              {"// NO DECORATION // MAXIMUM GEOMETRIC RESTRAINT //"}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
