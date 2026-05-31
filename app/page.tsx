"use client";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TheVerse } from "@/components/TheVerse";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen z-10 selection:bg-ivory selection:text-void flex flex-col items-center w-full">
      <Nav />
      <Hero />
      <TheVerse />
      <Footer />
    </main>
  );
}
