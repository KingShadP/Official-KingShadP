"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function RiveOverlay() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let currentScroll = 0;
    let targetScroll = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
    };

    const updatePosition = () => {
      currentScroll += (targetScroll - currentScroll) * 0.15;
      setScrollProgress(currentScroll);
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updatePosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (shouldReduceMotion) return null;

  // Calculate dynamic shapes / transforms based on scrollProgress
  const scale = 1 + (scrollProgress / 100) * 1.8;
  const rotation = (scrollProgress / 100) * 45;
  const opacity = Math.min(0.65, Math.max(0, 1 - (scrollProgress - 50) / 40));

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden mix-blend-screen select-none">
      {/* 
        Geometric Luxury Portal wireframe overlay reacting to scroll progress
        Creating a spatial 3D chamber entry illusion
      */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          opacity: opacity,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-[85vw] h-[85vh] text-[#d6a06e]/20 stroke-current fill-none stroke-[0.3]"
          aria-hidden="true"
        >
          {/* Centered multi-layered gold geometric luxury portals */}
          <rect x="10" y="10" width="80" height="80" rx="1" />
          <rect x="15" y="15" width="70" height="70" rx="1" className="opacity-75 stroke-[0.2]" />
          <rect x="20" y="20" width="60" height="60" rx="1" className="opacity-50 stroke-[0.1]" />
          
          <polygon points="50,5 95,50 50,95 5,50" className="opacity-40 stroke-[0.15]" />
          <polygon points="50,15 85,50 50,85 15,50" className="opacity-25 stroke-[0.1]" />

          {/* Diagonal Corner Accents */}
          <line x1="0" y1="0" x2="25" y2="25" className="opacity-60" />
          <line x1="100" y1="0" x2="75" y2="25" className="opacity-60" />
          <line x1="0" y1="100" x2="25" y2="75" className="opacity-60" />
          <line x1="100" y1="100" x2="75" y2="75" className="opacity-60" />

          {/* Circular Depth Rings */}
          <circle cx="50" cy="50" r="30" className="opacity-30 stroke-[0.1]" />
          <circle cx="50" cy="50" r="15" className="opacity-20 stroke-[0.1]" />
        </svg>
      </div>

      {/* Development Indicator showing the state machine value in gold tech theme */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-[#d6a06e]/60 uppercase tracking-widest bg-[#050505]/80 p-2.5 border border-[#d6a06e]/20 backdrop-blur-md shadow-lg select-none">
        State Machine :: ScrollDepth: {scrollProgress.toFixed(2)}%
      </div>
    </div>
  );
}

