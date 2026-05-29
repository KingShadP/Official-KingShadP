"use client";
import { useEffect, useState, memo } from "react";

export const Nav = memo(function Nav() {
  const [time, setTime] = useState("");

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
    <nav className="fixed top-0 left-0 right-0 z-50 p-6 lg:p-10 flex justify-between items-start pointer-events-none mix-blend-difference">
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
        <div className="font-mono text-[9px] text-ivory uppercase tracking-[0.4em] opacity-80 flex gap-4 pointer-events-auto">
          <a href="#vault" className="hover:text-gold transition-colors drop-shadow-md bg-void/50 px-3 py-1.5 border border-ivory/10 backdrop-blur-md hover:bg-ivory/5">Vault</a>
        </div>
        <div className="font-mono text-[10px] text-ivory/40 tracking-[0.2em]">
          {time} <span className="text-oxblood">UTC</span>
        </div>
      </div>
    </nav>
  );
});
