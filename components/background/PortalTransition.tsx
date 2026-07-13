"use client";

import { useReducedMotion } from "framer-motion";

type PortalTransitionProps = {
  progress?: number;
};

export function PortalTransition({ progress = 0 }: PortalTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 z-[-3] pointer-events-none overflow-hidden select-none">
      {/* 
        This is a modular arch frame/portal outline built of linear gradients 
        representing the monumental gold portals of the architecture.
      */}
      <div 
        className="absolute inset-[15%] border-[1px] border-[#d6a06e]/15 shadow-[0_0_100px_rgba(214,160,110,0.03)] flex items-center justify-center transition-all duration-300"
        style={{
          transform: `translate3d(0, 0, ${progress * 120}px) scale(${1 + progress * 0.45})`,
          opacity: Math.max(0, 0.4 - progress * 0.35),
          willChange: "transform, opacity"
        }}
      >
        {/* Arch Corners / Pillars */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#d6a06e]/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#d6a06e]/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#d6a06e]/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#d6a06e]/40" />
        
        {/* Inner glowing portal ring */}
        <div className="w-[80%] h-[80%] border border-[#d6a06e]/10 relative rounded-full opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,160,110,0.02),transparent_70%)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
