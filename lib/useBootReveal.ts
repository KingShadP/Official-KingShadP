"use client";

import { useEffect, useState } from "react";

/**
 * True once the signature bootloader has lifted (or was already shown
 * this session). Gates entrance animations so they play in view,
 * not hidden behind the boot panel.
 */
export function useBootReveal() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("ksp-boot")) {
      setReady(true);
      return;
    }
    const go = () => setReady(true);
    window.addEventListener("ksp:reveal", go, { once: true });
    const fallback = setTimeout(go, 4500);
    return () => {
      window.removeEventListener("ksp:reveal", go);
      clearTimeout(fallback);
    };
  }, []);

  return ready;
}
