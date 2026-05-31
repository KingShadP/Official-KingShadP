"use client";
import { useEffect, useState, memo } from "react";
import { MenuOverlay } from "@/components/MenuOverlay";

export const Nav = memo(function Nav() {
  const [time, setTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handle = setInterval(() => {
      const d = new Date();
      setTime(
        `${d.getUTCHours().toString().padStart(2, "0")}:${d
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}:${d
          .getUTCSeconds()
          .toString()
          .padStart(2, "0")}.${d
          .getUTCMilliseconds()
          .toString()
          .padStart(3, "0")}`
      );
    }, 47);
    return () => clearInterval(handle);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 p-6 lg:p-10 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="font-serif text-2xl text-ivory font-light italic tracking-tight opacity-90 pointer-events-auto cursor-pointer drop-shadow-md origin-left hover:scale-105 transition-transform">
            KingShadP<span className="text-oxblood drop-shadow-[0_0_8px_rgba(147,0,10,0.8)]">.</span>
          </div>
          <div className="font-mono text-[9px] text-ivory/50 uppercase tracking-[0.4em] flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_5px_rgba(220,197,123,0.8)]" />
            <span>SYS.LATENCY_NORM</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="font-mono text-xs text-ivory uppercase tracking-widest opacity-80 pointer-events-auto hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Open menu"
          >
            [ Menu ]
          </button>
          <div className="font-mono text-[10px] text-ivory/40 tracking-[0.2em] mt-2">
            {time} <span className="text-oxblood">UTC</span>
          </div>
        </div>
      </nav>
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
});
