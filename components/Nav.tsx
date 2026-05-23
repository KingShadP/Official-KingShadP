"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ScrambledText } from "@/components/ScrambledText";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["Vault", "Relics", "Codex", "Oracle"];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-1000 ${
        scrolled ? "bg-void/80 backdrop-blur-3xl border-b border-ivory/5 py-4" : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Brand */}
        <div className="w-1/3 flex justify-start">
          <a href="#" className="font-mono text-[9px] uppercase tracking-[0.4em] text-ivory/80 hover:text-ivory transition-colors">
            <ScrambledText text="System_KSP" />
          </a>
        </div>

        {/* Links */}
        <div className="hidden md:flex w-1/3 justify-center items-center space-x-12">
          {navItems.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[9px] uppercase tracking-[0.3em] text-ivory/40 hover:text-ivory transition-colors duration-500 relative group"
            >
              <span>{item}</span>
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-ivory group-hover:w-full transition-all duration-500 ease-[0.16,1,0.3,1]" />
            </motion.a>
          ))}
        </div>

        {/* Status / CTA */}
        <div className="w-1/3 flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 bg-ivory rotate-45 border border-white/20 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
            <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-ivory/50 hidden sm:block">
              Connection Secure
            </span>
          </motion.div>
        </div>

      </div>
    </motion.nav>
  );
}

