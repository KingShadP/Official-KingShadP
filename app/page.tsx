"use client";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TheVerse } from "@/components/TheVerse";
import { Footer } from "@/components/Footer";
import { Hero3D } from "@/components/Hero3D";
import { RiveOverlay } from "@/components/RiveOverlay";

export default function Home() {
  return (
    <main className="relative min-h-screen z-10 selection:bg-ivory selection:text-void flex flex-col items-center w-full">
      <RiveOverlay />
      <div className="fixed inset-0 z-0">
        <Hero3D />
      </div>
      <div className="relative z-10 w-full">
        <Nav />
        <Hero />
        <TheVerse />
        <Footer />
      </div>
    </main>
  );
}
