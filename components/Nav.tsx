"use client";

import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { MagneticNode } from "@/components/MagneticNode";
import { ScrambledText } from "@/components/ScrambledText";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 w-full z-50 flex justify-center px-4 pointer-events-none mix-blend-difference"
    >
      <div className={`pointer-events-auto rounded-full transition-all duration-700 flex items-center gap-10 px-8 py-4 ${
        scrolled ? "bg-void/60 backdrop-blur-3xl border border-rosegold/20 shadow-crimson-glow" : "bg-transparent"
      }`}>
        {/* Sacred Giragon Sigil Minified */}
        <MagneticNode>
          <div className="w-8 h-8 rounded-full border border-rosegold/50 flex items-center justify-center cursor-pointer group hover:bg-rosegold/10 transition-colors">
            <span className="font-serif text-rosegold text-xs group-hover:scale-110 transition-transform">G</span>
          </div>
        </MagneticNode>

        <div className="hidden md:flex items-center space-x-10">
          {["Vault", "Relics", "Codex", "Oracle"].map((item) => (
            <MagneticNode key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="font-sans text-[10px] uppercase tracking-[0.3em] text-ivory/80 hover:text-gold transition-colors duration-500 relative group p-2"
              >
                <ScrambledText text={item} />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
              </a>
            </MagneticNode>
          ))}
        </div>

        <MagneticNode>
          <button className="hidden md:flex items-center justify-center font-sans uppercase text-[10px] tracking-[0.3em] text-ivory/80 hover:text-gold p-2">
            <ScrambledText text="Sync" />
          </button>
        </MagneticNode>

        <button className="md:hidden text-ivory p-2 pointer-events-auto">
          <Menu className="w-5 h-5 opacity-70" />
        </button>
      </div>
    </motion.nav>
  );
}

