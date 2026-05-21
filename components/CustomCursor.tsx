"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Inner dot (ultra-responsive)
  const springConfigInner = { damping: 25, stiffness: 450, mass: 0.1 };
  const springXInner = useSpring(cursorX, springConfigInner);
  const springYInner = useSpring(cursorY, springConfigInner);

  // Outer ring (smooth fluid drag)
  const springConfigOuter = { damping: 40, stiffness: 200, mass: 0.5 };
  const springXOuter = useSpring(cursorX, springConfigOuter);
  const springYOuter = useSpring(cursorY, springConfigOuter);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    
    // Default show if already on page
    setIsVisible(true);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Dynamic Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden lg:flex items-center justify-center mix-blend-difference"
        style={{
          x: springXOuter,
          y: springYOuter,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div 
          animate={{
            scale: isClicking ? 0.7 : 1,
            backgroundColor: isClicking ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0)",
            borderColor: isClicking ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"
          }}
          transition={{ type: "spring", damping: 15, stiffness: 300, mass: 0.2 }}
          className="w-12 h-12 border-[1.5px] rounded-full flex items-center justify-center backdrop-blur-sm"
        />
      </motion.div>

      {/* Inner precise dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:flex items-center justify-center mix-blend-difference"
        style={{
          x: springXInner,
          y: springYInner,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div 
          animate={{
            scale: isClicking ? 2 : 1,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
          className="w-2 h-2 bg-ivory rounded-full shadow-[0_0_10px_#fff]" 
        />
      </motion.div>
    </>
  );
}
