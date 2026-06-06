"use client";

import { Nav } from "@/components/Nav";
import { VirtualKingdomBackground } from "@/components/background/VirtualKingdomBackground";
import { TheVerse } from "@/components/TheVerse";
import { Footer } from "@/components/Footer";
import dynamic from "next/dynamic";

const RiveOverlay = dynamic(() => import("@/components/RiveOverlay").then((mod) => mod.RiveOverlay), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen z-10 selection:bg-ivory selection:text-void flex flex-col items-center w-full bg-[#050505]">
      <RiveOverlay />
      <div className="relative z-10 w-full">
        <Nav />
        <VirtualKingdomBackground />
        <TheVerse />
        <Footer />
      </div>
    </main>
  );
}

