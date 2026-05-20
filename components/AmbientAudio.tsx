"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";

export function AmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed bottom-8 left-8 z-[60] flex items-center gap-4">
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-10 h-10 rounded-full border border-rosegold/30 flex items-center justify-center text-ivory/50 hover:text-gold hover:bg-white/5 hover:border-gold/50 transition-all duration-500 backdrop-blur-md bg-void/50 group velvet-shadow"
      >
        {isPlaying ? <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> : <VolumeX className="w-4 h-4 group-hover:scale-110 transition-transform" />}
      </button>
      <div className="flex items-end gap-1 h-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="w-[2px] bg-rosegold/50"
            animate={{ height: isPlaying ? ["20%", "100%", "40%", "80%", "20%"] : "20%" }}
            transition={{
              repeat: Infinity,
              duration: 1 + i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1 hidden md:flex">
         <span className="font-mono text-[7px] text-ivory/30 tracking-[0.4em] uppercase">
           [ {isPlaying ? "ACTIVE" : "MUTED"} ]
         </span>
         <span className="font-mono text-[6px] text-rosegold/50 tracking-[0.4em] uppercase">
           AURAL.CHANNEL.01
         </span>
      </div>
    </div>
  );
}
