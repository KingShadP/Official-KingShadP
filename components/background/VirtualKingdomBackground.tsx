"use client";

import { ReactNode } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { RoomScene } from "./RoomScene";
import { DepthFog } from "./DepthFog";
import { GoldLightSweep } from "./GoldLightSweep";
import { PortalTransition } from "./PortalTransition";
import { motion, AnimatePresence } from "framer-motion";

const rooms = [
  {
    id: "home",
    title: "KINGSHADP",
    kicker: "Music. Image. Story. World.",
    bg: "/ChatGPT Image May 28, 2026, 02_10_07 AM (5).png", // Existing static asset for grand entrance plate
    desc: "The official creative house of KingShadP — an artist-built universe of sound, visuals, writing, symbols, drops, and archive work."
  },
  {
    id: "music",
    title: "SONIC CORRIDOR",
    kicker: "The sound is the signal.",
    bg: "/ChatGPT Image May 28, 2026, 02_10_36 AM (1)-1.png", // Sonic room asset
    desc: "Extracting high-fidelity audio frequencies and deep signal protocols from the sacred archive vault."
  },
  {
    id: "visuals",
    title: "VISUAL HALL",
    kicker: "Campaigns. Symbols. Motion. Image.",
    bg: "/ChatGPT Image May 28, 2026, 02_10_07 AM (6)-1.png", // Visual gallery plate asset
    desc: "The crafted archive of presence and identity. Exploring multi-layered self-invention and design hierarchy."
  },
  {
    id: "oracle",
    title: "ORACLE ARCH",
    kicker: "Writing from inside the archive.",
    bg: "/ChatGPT Image May 28, 2026, 02_11_23 AM (1).png", // Oracle plate asset
    desc: "A sovereign digital chamber structured around wisdom, philosophy, ruler codes, and the luxury of silence."
  },
  {
    id: "world",
    title: "THE WORLD",
    kicker: "Symbols, mythology, and house rules.",
    bg: "/unisex-organic-mid-light-crafter-t-shirt-desert-dust-front-6a16dd454c251.jpg", // Final portal chamber plate asset
    desc: "Enter the cosmic sovereign garden. Deep mythology of The Creator and The Create Refusing to disappear."
  }
];

type VirtualKingdomBackgroundProps = {
  children?: ReactNode;
};

export function VirtualKingdomBackground({ children }: VirtualKingdomBackgroundProps) {
  const globalProgress = useScrollProgress();

  // Divide overall 0->1 progress into our rooms array
  const totalRooms = rooms.length;
  const activeIndexRaw = globalProgress * totalRooms;
  const activeIndex = Math.min(totalRooms - 1, Math.floor(activeIndexRaw));
  const segmentProgress = activeIndexRaw % 1; // 0 to 1 progress inside this room

  const activeRoom = rooms[activeIndex];

  return (
    <section
      className="virtual-kingdom w-full relative min-h-[500vh] bg-[#050505] overflow-clip"
      style={{
        "--scroll-progress": globalProgress,
        "clipPath": "inset(0 0 0 0)"
      } as React.CSSProperties}
    >
      {/* Structural sticky view window */}
      <div className="virtual-kingdom__stage sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#050505]">
        
        {/* Render all background scenes absolute, crossfading them elegantly */}
        {rooms.map((room, idx) => (
          <RoomScene
            key={room.id}
            id={room.id}
            title={room.title}
            kicker={room.kicker}
            bg={room.bg}
            isActive={idx === activeIndex}
            progress={idx === activeIndex ? segmentProgress : 0}
          />
        ))}

        {/* Dynamic Atmospheric Depth Overlays */}
        <DepthFog progress={globalProgress} />
        <GoldLightSweep progress={globalProgress} />
        <PortalTransition progress={globalProgress} />

        {/* Subtle Luxury Film Grain Frame Overlay */}
        <div className="absolute inset-0 z-[-1] pointer-events-none mix-blend-overlay bg-noise opacity-[0.25]" />

        {/* Content Safety Gradients */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#050505]/95 via-[#050505]/45 to-[#050505]/90" />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]/95" />

        {/* Cinematic Content overlay */}
        <div className="virtual-kingdom__content relative z-[2] w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoom.id}
              initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -35, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="virtual-kingdom__copy max-w-[800px] flex flex-col gap-5 select-none"
            >
              <span className="virtual-kingdom__kicker font-mono text-[10px] md:text-xs text-[#d6a06e] tracking-[0.3em] uppercase block">
                {activeRoom.kicker}
              </span>
              
              <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl text-[#f6eee8] leading-none tracking-tight font-extralight uppercase">
                {activeRoom.title}
              </h1>

              <p className="font-serif text-sm md:text-lg text-[#f6eee8]/75 font-light leading-relaxed max-w-[620px]">
                {activeRoom.desc}
              </p>

              {/* Seamless Action buttons or dynamic custom nodes */}
              <div className="flex flex-wrap gap-4 mt-6 items-center">
                {activeRoom.id === "home" && (
                  <>
                    <a href="#the-verse" className="px-5 py-2.5 border border-[#d6a06e]/30 bg-[#050505]/40 hover:bg-[#d6a06e]/10 hover:border-[#d6a06e] transition-all font-mono text-xs uppercase tracking-widest text-[#d6a06e] cursor-none shadow-md backdrop-blur-md">
                      Discover The Verse
                    </a>
                  </>
                )}
                {activeRoom.id === "music" && (
                  <a href="#sonic" className="px-5 py-2.5 border border-[#d6a06e]/30 bg-[#050505]/40 hover:bg-[#d6a06e]/10 hover:border-[#d6a06e] transition-all font-mono text-xs uppercase tracking-widest text-[#d6a06e] cursor-none shadow-md backdrop-blur-md">
                    Listen to Vault Vol. 1
                  </a>
                )}
                {activeRoom.id === "visuals" && (
                  <a href="#visuals" className="px-5 py-2.5 border border-[#d6a06e]/30 bg-[#050505]/40 hover:bg-[#d6a06e]/10 hover:border-[#d6a06e] transition-all font-mono text-xs uppercase tracking-widest text-[#d6a06e] cursor-none shadow-md backdrop-blur-md">
                    Explore Images
                  </a>
                )}
                {activeRoom.id === "oracle" && (
                  <a href="#oracle" className="px-5 py-2.5 border border-[#d6a06e]/30 bg-[#050505]/40 hover:bg-[#d6a06e]/10 hover:border-[#d6a06e] transition-all font-mono text-xs uppercase tracking-widest text-[#d6a06e] cursor-none shadow-md backdrop-blur-md">
                    Read Philosophy
                  </a>
                )}
                {activeRoom.id === "world" && (
                  <a href="#world" className="px-5 py-2.5 border border-[#d6a06e]/30 bg-[#050505]/40 hover:bg-[#d6a06e]/10 hover:border-[#d6a06e] transition-all font-mono text-xs uppercase tracking-widest text-[#d6a06e] cursor-none shadow-md backdrop-blur-md">
                    Summit Core Code
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {children}
        </div>
      </div>
    </section>
  );
}
