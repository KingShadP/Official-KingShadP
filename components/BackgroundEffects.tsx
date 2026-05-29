"use client";
import { useRef, memo, useCallback } from "react";
import { useEngine } from "./EngineProvider";

export const BackgroundEffects = memo(function BackgroundEffects() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEngine(useCallback((state) => {
    if (gridRef.current) {
      gridRef.current.style.transform = `translate3d(${state.mouseX}px, calc(${state.mouseY}px - ${state.scrollY}px), 0)`;
    }
  }, []));

  return (
    <>
      <div className="fixed inset-0 z-[-2] bg-void" />

      {/* Massive Geometries */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vw] max-w-[2800px] max-h-[2800px] border border-ivory/5 rounded-full pointer-events-none opacity-20 mix-blend-screen animate-[spin_240s_linear_infinite]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] max-w-[2200px] max-h-[2200px] border border-oxblood/10 rounded-full border-dashed pointer-events-none opacity-20 mix-blend-screen animate-[spin_180s_linear_infinite_reverse]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] border-4 border-t-gold/5 border-r-transparent border-b-oxblood/10 border-l-transparent rounded-full pointer-events-none opacity-30 mix-blend-screen animate-[spin_60s_linear_infinite]" />

      <div 
        ref={gridRef}
        className="fixed inset-[-100px] z-[0] pointer-events-none opacity-[0.06] flex items-center justify-center will-change-transform"
      >
        <div className="w-full h-full grid grid-cols-6 grid-rows-6 border border-ivory/20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-ivory/10" />
            ))}
        </div>
      </div>
      <div className="fixed inset-0 z-[90] pointer-events-none mix-blend-overlay bg-noise" />
      <div className="fixed inset-0 z-[99] pointer-events-none crt-scanlines opacity-70 mix-blend-overlay" />
      <div className="fixed left-0 w-[2px] h-[150px] bg-gradient-to-b from-transparent via-oxblood to-transparent shadow-[0_0_15px_rgba(147,0,10,0.8)] opacity-60 z-[98] pointer-events-none animate-laser-sweep" />
      <div className="fixed right-0 w-[2px] h-[150px] bg-gradient-to-b from-transparent via-oxblood to-transparent shadow-[0_0_15px_rgba(147,0,10,0.8)] opacity-60 z-[98] pointer-events-none animate-laser-sweep" style={{ animationDelay: '6s' }} />
    </>
  );
});
