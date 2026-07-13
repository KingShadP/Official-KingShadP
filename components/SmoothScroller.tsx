"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroller() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let active = true;
    function raf(time: number) {
      if (!active) return;
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      active = false;
      lenis.destroy();
    };
  }, []);

  return null;
}
