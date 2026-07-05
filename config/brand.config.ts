import { SITE_MEDIA } from "@/lib/site-media";

/**
 * BRAND CONFIG — instance layer.
 *
 * Everything here is KingShadP-specific. Rebranding this site (or spinning
 * up instance #2 of the template) means editing this file + site.config.ts
 * + the asset maps in lib/site-media.ts. Core components must never
 * hard-code any value that belongs here.
 *
 * Colors are semantic. Component classes map as:
 *   void   → background   panel  → surface   ivory → foreground
 *   bronze → accent       oxblood → accentAlt
 */
export const BRAND = {
  name: "KingShadP",
  wordmark: { text: "KingShadP", accent: "." },
  tagline: "Music. Image. Story. World.",
  description:
    "The official creative house of KingShadP — sound, image, story, and archive.",
  copyrightLine: "© MMXXVI KingShadP",
  bootLabel: "Official Website",

  colors: {
    background: "#070605",
    surface: "#100d0b",
    foreground: "#f2ede4",
    accent: "#c08d5d",
    accentAlt: "#7d0009",
  },

  /**
   * Fonts load via next/font in lib/fonts.ts (static requirement).
   * These names document the pairing; swapping fonts = edit lib/fonts.ts.
   */
  fonts: {
    display: "Playfair Display",
    body: "JetBrains Mono",
  },

  /** none | subtle | expressive — consumed by motion-aware components. */
  motionPreset: "expressive" as "none" | "subtle" | "expressive",

  assets: {
    bootMark: SITE_MEDIA.signature,
    ogImage: "/media/crest.webp",
    favicon: "/icon.png",
  },

  /**
   * Tone of voice (content guideline, not runtime logic):
   * restrained luxury; rank before noise; telemetry-style labels in mono;
   * avoid: crowns, "drip/drop", "exclusive", exclamation points.
   */
} as const;

export type BrandConfig = typeof BRAND;
