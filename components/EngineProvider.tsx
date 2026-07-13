"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";

type EngineContextType = {
  subscribe: (callback: (state: EngineState) => void) => () => void;
};

type EngineState = {
  time: number;
  deltaTime: number;
  scrollY: number;
  mouseX: number;
  mouseY: number;
  targetScrollY: number;
  targetMouseX: number;
  targetMouseY: number;
};

const EngineContext = createContext<EngineContextType | null>(null);

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const clock = useRef(0);
  const scrollY = useRef(0);
  const targetScrollY = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetMouseX = useRef(0);
  const targetMouseY = useRef(0);

  const listeners = useRef(new Set<(state: EngineState) => void>());

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX.current = (e.clientX / window.innerWidth - 0.5) * 40;
      targetMouseY.current = (e.clientY / window.innerHeight - 0.5) * 40;
    };

    const handleScroll = () => {
      targetScrollY.current = window.scrollY * 0.15;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const update = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      clock.current += deltaTime;

      mouseX.current += (targetMouseX.current - mouseX.current) * 0.05;
      mouseY.current += (targetMouseY.current - mouseY.current) * 0.05;
      scrollY.current += (targetScrollY.current - scrollY.current) * 0.08;

      const state: EngineState = {
        time: clock.current,
        deltaTime,
        scrollY: scrollY.current,
        mouseX: mouseX.current,
        mouseY: mouseY.current,
        targetScrollY: targetScrollY.current,
        targetMouseX: targetMouseX.current,
        targetMouseY: targetMouseY.current
      };

      listeners.current.forEach((cb) => cb(state));
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const subscribe = (callback: (state: EngineState) => void) => {
    listeners.current.add(callback);
    return () => listeners.current.delete(callback);
  };

  return (
    <EngineContext.Provider value={{ subscribe }}>
      {children}
    </EngineContext.Provider>
  );
}

export function useEngine(callback: (state: EngineState) => void) {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error("useEngine must be used within EngineProvider");
  
  useEffect(() => {
    return ctx.subscribe(callback);
  }, [ctx, callback]);
}
