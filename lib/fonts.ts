import { Playfair_Display, JetBrains_Mono } from "next/font/google";

/**
 * FONT SWAP POINT — instance layer.
 * next/font requires statically analyzable imports, so font choice cannot
 * live in runtime config. To rebrand typography: change the two imports and
 * loaders below, keep the exported variable names. Nothing else references
 * concrete font families — components use font-serif / font-mono classes
 * mapped to these CSS variables in tailwind.config.ts.
 */

export const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const bodyFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
