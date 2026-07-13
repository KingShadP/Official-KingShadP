"use client";
import { useEffect, useState, memo } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";

export const ScrambleText = memo(function ScrambleText({ text, delay = 0, duration = 1000 }: { text: string, delay?: number, duration?: number }) {
  const [display, setDisplay] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let startTime: number;
    let animationFrame: number;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < delay) {
        animationFrame = requestAnimationFrame(tick);
        return;
      }

      const activeProgress = progress - delay;
      const revealCount = Math.floor((activeProgress / duration) * text.length);

      if (revealCount >= text.length) {
        setDisplay(text);
        return;
      }

      let scrambled = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealCount) {
          scrambled += text[i];
        } else if (text[i] === " " || text[i] === "\n") {
          scrambled += text[i];
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(scrambled);
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [text, delay, duration]);

  if (!mounted) {
    return <span className="opacity-0">{text}</span>;
  }

  return <span>{display}</span>;
});
