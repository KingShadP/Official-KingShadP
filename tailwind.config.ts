import type { Config } from "tailwindcss";

/**
 * CORE — color classes resolve to CSS variables injected from
 * config/brand.config.ts (see lib/theme.ts). Rebranding never edits this
 * file. Class names are semantic aliases:
 *   void=background, panel=surface, ivory=foreground,
 *   bronze=accent, oxblood=accentAlt, gold=legacy alias of accent.
 */
const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        void: "rgb(var(--brand-background) / <alpha-value>)",
        panel: "rgb(var(--brand-surface) / <alpha-value>)",
        ivory: "rgb(var(--brand-foreground) / <alpha-value>)",
        bronze: "rgb(var(--brand-accent) / <alpha-value>)",
        oxblood: "rgb(var(--brand-accent-alt) / <alpha-value>)",
        // legacy alias
        gold: "rgb(var(--brand-accent) / <alpha-value>)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
