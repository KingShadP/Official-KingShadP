"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Inner dot (fast)
  const springConfigInner = { damping: 40, stiffness: 400 };
  const springXInner = useSpring(cursorX, springConfigInner);
  const springYInner = useSpring(cursorY, springConfigInner);

  // Outer anti-gravity field (slow, floating)
  const springConfigOuter = { damping: 20, stiffness: 100, mass: 0.8 };
  const springXOuter = useSpring(cursorX, springConfigOuter);
  const springYOuter = useSpring(cursorY, springConfigOuter);

  // Satellite orbit field
  const springConfigSat = { damping: 15, stiffness: 60, mass: 1.5 };
  const springXSat = useSpring(cursorX, springConfigSat);
  const springYSat = useSpring(cursorY, springConfigSat);

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
      {/* Outer Anti-Gravity Ripple / Field */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] hidden lg:flex items-center justify-center mix-blend-screen"
        style={{
          x: springXSat,
          y: springYSat,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 0.3 : 0,
        }}
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: isClicking ? 1.5 : 1,
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 8, ease: "linear" },
              scale: { type: "spring", damping: 15, stiffness: 200 }
            }}
            className="absolute inset-0 rounded-full border border-dashed border-rosegold/30" 
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: isClicking ? 0.8 : 1,
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 12, ease: "linear" },
              scale: { type: "spring", damping: 15, stiffness: 200 }
            }}
            className="absolute inset-4 rounded-full border border-rosegold/10"
          />
        </div>
      </motion.div>

      {/* Main Cursor Ring */}
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
            scale: isClicking ? 0.5 : 1,
            backgroundColor: isClicking ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0)"
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-10 h-10 border-[1px] border-ivory/50 rounded-full flex items-center justify-center backdrop-blur-[2px]"
        >
           {/* Anti-gravity glow */}
           <div className="absolute inset-0 rounded-full bg-ivory/5 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        </motion.div>
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
        <div className="w-1.5 h-1.5 bg-ivory rounded-full shadow-[0_0_10px_#fff]" />
      </motion.div>
    </>
  );
}
