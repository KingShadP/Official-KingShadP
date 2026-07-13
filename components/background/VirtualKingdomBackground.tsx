"use client";

import { ReactNode } from "react";
import { RoomScene } from "./RoomScene";
import { DepthFog } from "./DepthFog";
import { GoldLightSweep } from "./GoldLightSweep";
import { PortalTransition } from "./PortalTransition";

const rooms = [
  {
    id: "home",
    title: "KINGSHADP",
    kicker: "Music. Image. Story. World.",
    bg: "/chatgpt_image_may_28_2026_02_10_07_am_5_.png", // Existing static asset for grand entrance plate
    desc: "The official creative house of KingShadP — an artist-built universe of sound, visuals, writing, symbols, drops, and archive work."
  },
  {
    id: "music",
    title: "SONIC CORRIDOR",
    kicker: "The sound is the signal.",
    bg: "/chatgpt_image_may_28_2026_02_10_36_am_1_1.png", // Sonic room asset
    desc: "Extracting high-fidelity audio frequencies and deep signal protocols from the sacred archive vault."
  },
  {
    id: "visuals",
    title: "VISUAL HALL",
    kicker: "Campaigns. Symbols. Motion. Image.",
    bg: "/chatgpt_image_may_28_2026_02_10_07_am_6_1.png", // Visual gallery plate asset
    desc: "The crafted archive of presence and identity. Exploring multi-layered self-invention and design hierarchy."
  },
  {
    id: "oracle",
    title: "ORACLE ARCH",
    kicker: "Writing from inside the archive.",
    bg: "/chatgpt_image_may_28_2026_02_11_23_am_1_.png", // Oracle plate asset
    desc: "A sovereign digital chamber structured around wisdom, philosophy, ruler codes, and the luxury of silence."
  },
  {
    id: "world",
    title: "THE WORLD",
    kicker: "Symbols, mythology, and house rules.",
    bg: "/unisex_organic_mid_light_crafter_t_shirt_desert_dust_front_6a16dd454c251.jpg", // Final portal chamber plate asset
    desc: "Enter the cosmic sovereign garden. Deep mythology of The Creator and The Create Refusing to disappear."
  }
];

type VirtualKingdomBackgroundProps = {
  activeView: string;
  children?: ReactNode;
};

export function VirtualKingdomBackground({ activeView, children }: VirtualKingdomBackgroundProps) {
  // Map our app's active view to one of the 5 immersive rooms
  let activeIndex = 0;
  if (activeView === "music") {
    activeIndex = 1;
  } else if (activeView === "archive") {
    activeIndex = 2;
  } else if (activeView === "lookbook") {
    activeIndex = 3;
  } else if (activeView === "vision" || activeView === "opportunities" || activeView === "contact") {
    activeIndex = 4;
  }

  // Pure aesthetic constant progress for the static luxury frames (subtle organic breathing feel)
  const segmentProgress = 0.15; 
  const globalProgress = activeIndex / rooms.length;

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[#030303] pointer-events-none">
      {/* Structural view window */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#030303]">
        
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
        <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay bg-noise opacity-[0.2]" />

        {/* Content Safety Gradients for maximum text readability */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#030303]/95 via-[#030303]/50 to-[#030303]/90" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#030303]/85 via-transparent to-[#030303]/95" />

        {children}
      </div>
    </div>
  );
}

