"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, -400]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -200]);
  const rotate1 = useTransform(scrollY, [0, 2000], [0, 180]);
  const rotate2 = useTransform(scrollY, [0, 2000], [0, -90]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#090908]">
      {/* Deep atmospheric gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090908] via-[#0f0e0d] to-[#050505] opacity-80" />

      {/* Parallax Layer 1 (Slowest, deepest) */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        <motion.div 
          style={{ rotate: rotate1 }} 
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[#dcc57b]/5 rounded-full blur-[120px]"
        />
        <motion.div 
          style={{ rotate: rotate1 }} 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#93000a]/5 rounded-full blur-[100px]"
        />
      </motion.div>

      {/* Parallax Layer 2 (Faster) */}
      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {/* Orbital shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] opacity-10"
        >
          <div className="absolute top-10 left-1/2 w-2 h-2 bg-[#dcc57b] rounded-full shadow-[0_0_10px_#dcc57b]" />
          <div className="absolute bottom-10 left-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
          <div className="absolute right-10 top-1/3 w-3 h-3 bg-[#93000a] rounded-full shadow-[0_0_15px_#93000a]" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
            <circle cx="500" cy="500" r="490" stroke="#dcc57b" strokeWidth="0.5" fill="none" strokeDasharray="10 20" />
            <circle cx="500" cy="500" r="300" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="5 30" opacity="0.5" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
