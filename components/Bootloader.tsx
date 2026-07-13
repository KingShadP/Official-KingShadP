"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Bootloader({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const sequence = [
      "INITIALIZING SOVEREIGN KERNEL v9.0...",
      "ESTABLISHING SECURE HANDSHAKE...",
      "BYPASSING LOCAL RESTRICTIONS...",
      "VERIFYING CRYPTOGRAPHIC SIGNATURE...",
      "SIGNATURE VALIDATED.",
      "LOADING ARCHIVE HOLOGRAPHICS...",
      "PREPARING LUXURY RENDER ENGINE...",
      "WELCOME TO THE VERSE."
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < sequence.length) {
        setLogs(prev => [...prev, sequence[currentLog]]);
        currentLog++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setStage(1), 800);
      }
    }, 250);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (stage === 1) {
      const t = setTimeout(() => {
        onComplete();
      }, 2500); // Allow time for signature animation
      return () => clearTimeout(t);
    }
  }, [stage, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 1 ? 0 : 1 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="fixed inset-0 z-50 bg-[#090908] text-[#dcc57b] font-mono text-[10px] sm:text-xs flex flex-col justify-between p-8"
    >
      <div className="flex flex-col gap-1 uppercase tracking-widest opacity-70">
        {logs.map((log, i) => (
          <div key={i}>{">"} {log}</div>
        ))}
        {stage === 0 && <div className="animate-pulse">{">"} _</div>}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {stage === 1 && (
          <motion.svg
            width="300"
            height="150"
            viewBox="0 0 300 150"
            className="stroke-[#dcc57b] fill-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.path
              d="M 50 100 C 50 50, 100 50, 100 100 C 100 150, 150 150, 150 100 C 150 50, 200 50, 200 100 C 200 150, 250 150, 250 100"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {/* "KingShadP" signature abstraction */}
            <motion.path
              d="M 40 40 L 40 120 M 40 80 L 80 40 M 80 120 L 120 40 M 120 40 L 160 120 M 110 80 L 150 80 M 180 120 C 180 80, 220 80, 220 120 C 220 160, 180 160, 180 120 M 240 120 L 240 40 M 240 40 C 280 40, 280 80, 240 80"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </motion.svg>
        )}
      </div>

      <div className="flex justify-between items-end opacity-50 uppercase tracking-[0.2em]">
        <span>DIAGNOSTIC: SECURE</span>
        <span>2026-07-12_SYS_ACTIVE</span>
      </div>
    </motion.div>
  );
}
