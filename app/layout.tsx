import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
      <body className="font-sans antialiased bg-[#090908] text-[#dcc57b] overflow-x-hidden selection:bg-[#dcc57b] selection:text-[#090908]">
        {children}
      </body>
    </html>
  );
}
