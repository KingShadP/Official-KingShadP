"use client";

import { motion } from "framer-motion";

export function DepthFog() {
  return (
    <div className="absolute inset-0 z-[-5] pointer-events-none overflow-hidden select-none">
      {/* Volumetric smoky fog layers */}
      <div 
        className="absolute left-[-20%] right-[-20%] bottom-[-15%] h-[55%] pointer-events-none filter blur-[32px] opacity-[0.38] mix-blend-screen"
        style={{
          background: `
            radial-gradient(ellipse at 25% 65%, rgba(255, 255, 255, 0.08), transparent 45%),
            radial-gradient(ellipse at 75% 48%, rgba(214, 160, 110, 0.12), transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(5, 5, 5, 0.45), transparent 65%)
          `,
          transform: `translate3d(calc(var(--scroll-progress, 0) * 4vw), calc(var(--scroll-progress, 0) * -3vh), 0) scale(calc(1 + (var(--scroll-progress, 0) * 0.15)))`,
          animation: "kingdomFogDrift 16s ease-in-out infinite alternate"
        }}
      />
      <div 
        className="absolute left-[-10%] right-[-10%] bottom-[-5%] h-[40%] pointer-events-none filter blur-[24px] opacity-[0.24] mix-blend-color-dodge"
        style={{
          background: `
            radial-gradient(ellipse at 35% 80%, rgba(214, 160, 110, 0.07), transparent 35%),
            radial-gradient(ellipse at 65% 70%, rgba(255, 255, 255, 0.05), transparent 40%)
          `,
          transform: `translate3d(calc(var(--scroll-progress, 0) * -2vw), calc(var(--scroll-progress, 0) * -2vh), 0) scale(calc(1 + (var(--scroll-progress, 0) * 0.1)))`,
          animation: "kingdomFogDrift 22s ease-in-out infinite alternate-reverse"
        }}
      />
    </div>
  );
}
