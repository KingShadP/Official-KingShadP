"use client";
import { useEffect, useState, memo } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor = memo(function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springX = useSpring(cursorX, { damping: 25, stiffness: 400, mass: 0.1 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 400, mass: 0.1 });

  const dotSize = isHovering ? 8 : 4;
  const ringSize = isHovering ? 56 : 32;

  useEffect(() => {
    // Disable default cursor
    document.body.style.cursor = "none";

    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("pointermove", updateCursor, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updateCursor);
      document.body.style.cursor = "auto";
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <>
      {isVisible && (
        <>
          {/* Trailing Neon Ring */}
          <motion.div
            className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border border-solid mix-blend-difference"
            style={{ 
               x: springX, 
               y: springY, 
               translateX: "-50%", 
               translateY: "-50%",
               width: ringSize,
               height: ringSize,
               borderColor: 'rgba(255,255,255,1)',
            }}
            animate={isHovering ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ 
               type: 'spring', 
               stiffness: 300, 
               damping: 25,
               scale: { repeat: Infinity, duration: 2 }
            }}
          />
          
          {/* Central Matte Dot */}
          <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-white mix-blend-difference"
            style={{ 
               x: cursorX, 
               y: cursorY, 
               translateX: "-50%", 
               translateY: "-50%",
               width: dotSize,
               height: dotSize,
            }}
          />
        </>
      )}
    </>
  );
});
