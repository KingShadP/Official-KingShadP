"use client";
import { memo, useRef, useCallback } from "react";
import { useEngine } from "./EngineProvider";

export const ScrollProgress = memo(function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEngine(useCallback((state) => {
    if (barRef.current) {
      // document.documentElement.scrollHeight - window.innerHeight
      // We can calculate progress without triggering react renders
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (state.targetScrollY / maxScroll) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    }
  }, []));

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-oxblood z-[100] origin-left will-change-transform"
      style={{ transform: "scaleX(0)" }}
    />
  );
});
