import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        void: "#fdfbf7",
        ivory: "#0a0a0a",
        oxblood: "#93000a",
        gold: "#dcc57b",
      },
      animation: {
        'laser-sweep': 'border-laser-sweep 12s cubic-bezier(0.4,0,0.2,1) infinite',
      },
      keyframes: {
        'border-laser-sweep': {
          '0%': { top: '-120px' },
          '100%': { top: 'calc(100vh + 120px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
