"use client";
import { useState, useEffect } from "react";

export function ScrambledText({ text, as: Component = "span", className = "" }: { text: string, as?: any, className?: string }) {
  const [output, setOutput] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = "!<>-_\\\\/[]{}—=+*^?#________";

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    let iterations = 0;
    const interval = setInterval(() => {
      setOutput(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      iterations += 1 / 3;
    }, 30);
  };

  return (
    <Component className={className} onMouseEnter={scramble}>
      {output}
    </Component>
  );
}
