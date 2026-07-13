"use client";

import { useReducedMotion } from "framer-motion";

type RoomSceneProps = {
  id: string;
  title: string;
  kicker: string;
  bg: string;
  isActive: boolean;
  progress: number; // 0 to 1 progress within this specific room segment
};

export function RoomScene({ id, title, kicker, bg, isActive, progress }: RoomSceneProps) {
  const shouldReduceMotion = useReducedMotion();

  // Create customized CSS custom properties for scroll-progress inside the active plate
  const scrollTransform = shouldReduceMotion
    ? "none"
    : `translate3d(
        calc(${progress} * -1.2vw),
        calc(${progress} * -0.4vh),
        0
      )
      scale(calc(1.05 + (${progress} * 0.12)))`;

  const brightness = 0.72 + progress * 0.14;

  return (
    <div
      className={`absolute inset-0 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
        isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
      }`}
      style={{
        transform: shouldReduceMotion
          ? "none"
          : isActive
          ? "scale(1) translateY(0px)"
          : `scale(1.06) translateY(30px)`,
        willChange: "opacity, transform",
      }}
    >
      {/* 
        The Background Plate: Uses custom webp images if available.
        Integrates a heavy procedural fallback layer so it looks highly styled and architectural
        even when the images are loading or absent.
      */}
      <div
        className="absolute inset-[-4%] bg-cover bg-center bg-no-repeat transition-all"
        style={{
          backgroundImage: `url(${bg})`,
          transform: scrollTransform,
          filter: `brightness(${brightness}) contrast(1.15)`,
          willChange: "transform, filter",
        }}
      >
        {/* Procedural Architectural Fallback (Generates stunning black-marble column plates dynamically) */}
        <div className="absolute inset-0 bg-[#050505]/75 mix-blend-multiply" />
        
        {/* Floor Line Reflection Plates (gold-trim architectural grid) */}
        <div 
          className="absolute left-0 right-0 bottom-0 h-[45%] pointer-events-none opacity-40 mix-blend-color-dodge transition-transform duration-300"
          style={{
            background: `
              linear-gradient(180deg, transparent, rgba(214,160,110,0.18)),
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 140px,
                rgba(214,160,110,0.08) 141px,
                transparent 144px
              )
            `,
            transform: `translate3d(0, calc(${progress} * 2.5vh), 0) scaleY(calc(1 + (${progress} * 0.15)))`
          }}
        />

        {/* Room-Specific Procedural 3D Visual Embeds (Pure CSS/SVG high-end artwork) */}
        {id === "home" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-color-dodge">
            <svg viewBox="0 0 100 100" className="w-[60vw] max-w-[600px] text-[#d6a06e]">
              {/* Grand Citadel Portal Gate */}
              <path d="M 10,95 L 10,50 A 40,40 0 0,1 90,50 L 90,95 Z" fill="none" stroke="currentColor" strokeWidth="0.4" />
              <path d="M 20,95 L 20,50 A 30,30 0 0,1 80,50 L 80,95 Z" fill="none" stroke="currentColor" strokeWidth="0.2" className="opacity-70" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.3" className="opacity-50" />
            </svg>
          </div>
        )}

        {id === "music" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-35 mix-blend-screen">
            <svg viewBox="0 0 100 40" className="w-[80vw] max-w-[800px] text-[#d6a06e]">
              {/* Luxury Gold Soundwave Symmetrical Geometry */}
              <path d="M 5,20 Q 15,2 25,38 T 45,2 T 65,38 T 85,2 T 95,20" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <path d="M 5,20 Q 15,38 25,2 T 45,38 T 65,2 T 85,38 T 95,20" fill="none" stroke="currentColor" strokeWidth="0.15" className="opacity-50" />
            </svg>
          </div>
        )}

        {id === "visuals" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.25] mix-blend-color-dodge">
            {/* Monumental Cinematic Gallery Framing */}
            <div 
              className="w-[70vw] h-[45vh] border border-[#d6a06e]/50 rounded-sm relative flex items-center justify-center"
              style={{
                transform: `rotateX(15deg) scale(calc(1 + (${progress} * 0.1)))`
              }}
            >
              <div className="absolute inset-8 border border-[#d6a06e]/20 opacity-65" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d6a06e]/5 to-transparent" />
            </div>
          </div>
        )}

        {id === "oracle" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-screen">
            <svg 
              viewBox="0 0 100 100" 
              className="w-[50vw] max-w-[500px] text-[#d6a06e] transition-transform duration-1000 ease-out"
              style={{
                transform: `rotate(calc(${progress} * 30deg))`
              }}
            >
              {/* Rotating Astrolabe/Oracle Dial */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.15" strokeDasharray="4,4" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.2" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.15" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.15" />
            </svg>
          </div>
        )}

        {id === "world" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-color-dodge">
            <svg 
              viewBox="0 0 100 100" 
              className="w-[65vw] max-w-[650px] text-[#d6a06e]"
              style={{
                transform: `scale(calc(1 - (${progress} * 0.15)))`
              }}
            >
              {/* Deep infinite vortex rings */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-80" />
              <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="0.2" className="opacity-60" />
              <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="0.15" className="opacity-40" />
            </svg>
          </div>
        )}
      </div>

      {/* Atmospheric depth overlay gradient per room scene */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-[#050505]/75 via-transparent to-[#050505]/95 pointer-events-none" />
    </div>
  );
}
