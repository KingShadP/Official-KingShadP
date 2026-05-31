"use client";

import { useEffect, useState } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export function RiveOverlay() {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const STATE_MACHINE_NAME = "State Machine 1";
  const INPUT_NAME = "ScrollDepth"; // Ensure this matches the Rive file input name

  const { rive, RiveComponent } = useRive({
    src: "/page-transition.riv", // Provide the actual path when using real assets
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  });

  // Fetch the specific input from the state machine to drive changes manually
  const scrollInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    INPUT_NAME
  );

  useEffect(() => {
    // Scroll listener with a small lerp for smoothing before applying to Rive
    let currentScroll = 0;
    let targetScroll = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      // Calculate scroll progress from 0 to 100
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
    };

    const updateRive = () => {
      // Lerp function to smooth scroll delta
      currentScroll += (targetScroll - currentScroll) * 0.1;
      
      // Feed the smoothed number into the Rive listener
      if (scrollInput) {
        scrollInput.value = currentScroll;
      }
      
      setScrollProgress(currentScroll);
      animationFrameId = requestAnimationFrame(updateRive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateRive();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollInput]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 opacity-50 mix-blend-screen">
      {/* 
        This handles the Rive vector transitions. 
        If no .riv file exists, this will silently fail in the browser but provide the requested architecture.
      */}
      <RiveComponent className="w-full h-full" />
      
      {/* Development Indicator showing the injected state machine value */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-ivory/50 uppercase tracking-widest bg-void/50 p-2 border border-ivory/10 backdrop-blur-sm">
        Rive Input :: ScrollDepth: {scrollProgress.toFixed(2)}%
      </div>
    </div>
  );
}
