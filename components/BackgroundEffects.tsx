"use client";
import { useRef, memo } from "react";

export const BackgroundEffects = memo(function BackgroundEffects() {
  return (
    <>
      {/* Absolute solid dark void canvas */}
      <div className="fixed inset-0 z-[-2] bg-[#030303]" />

      {/* Luxury Symmetrical Ambient Light Pools */}
      {/* Soft velvet-burgundy deep backdrop pool */}
      <div className="fixed -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-oxblood/15 to-transparent blur-[120px] pointer-events-none mix-blend-screen opacity-40" />
      
      {/* Soft warm gold ambient trace pool */}
      <div className="fixed -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full bg-gradient-to-tl from-gold/10 to-transparent blur-[140px] pointer-events-none mix-blend-screen opacity-30" />

      {/* Subtle luxury paper-like texture film grain overlay */}
      <div className="fixed inset-0 z-[90] pointer-events-none mix-blend-overlay bg-noise opacity-[0.18]" />
    </>
  );
});

