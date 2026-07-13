"use client";
import { motion } from "framer-motion";
import { memo, useRef, useCallback } from "react";
import { useEngine } from "./EngineProvider";

export const Radar = memo(function Radar() {
  const beamRef = useRef<HTMLDivElement>(null);

  useEngine(useCallback((state) => {
    if (beamRef.current) {
      beamRef.current.style.transform = `rotate(${(state.time * 0.06) % 360}deg)`;
    }
  }, []));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.25] mix-blend-screen z-0">
      <div className="relative w-[150vw] h-[150vw] sm:w-[900px] sm:h-[900px] rounded-full border border-oxblood/30 flex items-center justify-center">
        {/* Radar Rings */}
        <div className="absolute w-[75%] h-[75%] rounded-full border border-oxblood/20" />
        <div className="absolute w-[50%] h-[50%] rounded-full border border-oxblood/30 border-dashed" />
        <div className="absolute w-[25%] h-[25%] rounded-full border border-oxblood/40" />
        
        {/* Crosshairs */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-oxblood/40 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-oxblood/40 to-transparent" />

        {/* Rotating Beam */}
        <div 
          ref={beamRef}
          className="absolute w-1/2 h-[2px] right-1/2 top-1/2 origin-right will-change-transform"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] origin-right bg-[conic-gradient(from_270deg_at_100%_50%,rgba(147,0,10,0.3)_0deg,transparent_60deg)] pointer-events-none" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-l from-oxblood to-transparent opacity-80" />
        </div>

        {/* Ping Markers */}
        <motion.div
           className="absolute w-3 h-3 rounded-full bg-gold shadow-[0_0_20px_#dcc57b]"
           style={{ top: '35%', left: '65%' }}
           animate={{ opacity: [0, 1, 0], scale: [0.5, 2.5, 0.5] }}
           transition={{ duration: 6, repeat: Infinity, delay: 0.8 }}
        />
        <motion.div
           className="absolute w-2 h-2 rounded-full bg-ivory shadow-[0_0_15px_#f4f1eb]"
           style={{ bottom: '20%', left: '30%' }}
           animate={{ opacity: [0, 1, 0], scale: [0.5, 1.8, 0.5] }}
           transition={{ duration: 6, repeat: Infinity, delay: 3.5 }}
        />
        <motion.div
           className="absolute w-1.5 h-1.5 rounded-full bg-oxblood shadow-[0_0_10px_#93000a]"
           style={{ top: '60%', left: '75%' }}
           animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 0.5] }}
           transition={{ duration: 6, repeat: Infinity, delay: 4.8 }}
        />
      </div>
    </div>
  );
});
