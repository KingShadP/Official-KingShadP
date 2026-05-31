"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const FloatingActionButton = memo(function FloatingActionButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-40 pointer-events-auto"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: shouldReduceMotion ? 0 : 1, duration: shouldReduceMotion ? 0.2 : 1 }}
    >
      <button
        aria-label="Scegli la tua experience"
        className="group relative flex items-center justify-center p-4 rounded-full bg-ivory text-void hover:bg-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase font-bold mr-2 whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[200px] transition-[max-width] duration-300 ease-in-out">
          Scegli la tua experience
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      </button>
    </motion.div>
  );
});
