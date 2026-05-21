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
        className="w-10 h-10 rounded-full border border-ivory/10 flex items-center justify-center text-ivory/50 hover:text-ivory hover:bg-ivory/[0.02] hover:border-ivory/30 transition-all duration-500 bg-void/50 backdrop-blur-md group"
      >
        {isPlaying ? <Volume2 className="w-3 h-3 transition-transform" /> : <VolumeX className="w-3 h-3 transition-transform" />}
      </button>
      <div className="flex items-end gap-1 h-3 opacity-30">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="w-px bg-ivory"
            animate={{ height: isPlaying ? ["20%", "100%", "40%", "80%", "20%"] : "20%" }}
            transition={{
              repeat: Infinity,
              duration: 1 + i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1 hidden md:flex ml-2">
         <span className="font-mono text-[7px] text-ivory/30 tracking-[0.4em] uppercase">
           Aural // {isPlaying ? "Active" : "Muted"}
         </span>
      </div>
    </div>
  );
}
