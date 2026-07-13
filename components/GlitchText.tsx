"use client";

import React, { useState, useEffect } from "react";

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const [glitchedText, setGlitchedText] = useState(text);
  const [isGlitched, setIsGlitched] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const runGlitch = () => {
      setIsGlitched(true);
      const chars = "X█▓░░█▒░▄▀▄██◤◢";
      let count = 0;

      const glitchInterval = setInterval(() => {
        const mutated = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (Math.random() > 0.85) {
              return chars[Math.floor(Math.random() * chars.length)];
            }
            return char;
          })
          .join("");

        setGlitchedText(mutated);
        count++;

        if (count > 5) {
          clearInterval(glitchInterval);
          setGlitchedText(text);
          setIsGlitched(false);
        }
      }, 60);
    };

    // Trigger glitch every 4-8 seconds randomly
    interval = setInterval(() => {
      if (Math.random() > 0.3) {
        runGlitch();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [text]);

  return (
    <span
      className={`relative inline-block select-all transition-all duration-300 ${
        isGlitched ? "text-oxblood translate-x-[1px]" : ""
      } ${className}`}
      data-text={text}
    >
      {glitchedText}
    </span>
  );
}
