import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { CustomCursor } from "@/components/CustomCursor";
import { CelestialEventToast } from "@/components/CelestialEventToast";
import { ScrollProgress } from "@/components/ScrollProgress";

import { EngineProvider } from "@/components/EngineProvider";
import { SmoothScroller } from "@/components/SmoothScroller";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "KingShadP // Archive",
  description: "The Sovereign System Archive of KingShadP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jetbrains.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-void text-ivory cursor-none">
        <EngineProvider>
          <SmoothScroller />
          <ScrollProgress />
          <BackgroundEffects />
          <CustomCursor />
          {children}
          <FloatingActionButton />
          <CelestialEventToast />
        </EngineProvider>
      </body>
    </html>
  );
}
