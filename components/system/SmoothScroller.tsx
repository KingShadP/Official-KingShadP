"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroller() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    let active = true;
    const raf = (time: number) => {
      if (!active) return;
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      active = false;
      lenis.destroy();
    };
  }, []);

  // Hard reset scroll on route change (transition panel hides the jump).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
