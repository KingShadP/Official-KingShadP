import type { Metadata, Viewport } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/components/system/TransitionProvider";
import { SmoothScroller } from "@/components/system/SmoothScroller";
import { Preloader } from "@/components/system/Preloader";
import { SiteChrome } from "@/components/system/SiteChrome";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "KingShadP — Official",
  description:
    "The official KingShadP Website",
};

export const viewport: Viewport = {
  themeColor: "#070605",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-mono antialiased bg-void text-ivory">
        <TransitionProvider>
          <SmoothScroller />
          <Preloader />
          <SiteChrome />
          <main className="relative">{children}</main>
        </TransitionProvider>
      </body>
    </html>
  );
}
