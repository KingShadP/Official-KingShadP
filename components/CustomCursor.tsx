"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "motion/react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverType, setHoverType] = useState<"default" | "interactive" | "text">("default");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Inner dot / Crosshair (extremely responsive)
  const springConfigInner = { damping: 30, stiffness: 600, mass: 0.15 };
  const springXInner = useSpring(cursorX, springConfigInner);
  const springYInner = useSpring(cursorY, springConfigInner);

  // Outer glowing ring / rotating sigil (smooth and floating)
  const springConfigOuter = { damping: 45, stiffness: 220, mass: 0.6 };
  const springXOuter = useSpring(cursorX, springConfigOuter);
  const springYOuter = useSpring(cursorY, springConfigOuter);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };

    // Detect reduced motion preference
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    };

    checkTouch();
    checkReducedMotion();

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Track if hovering over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.closest('input[type="submit"]') ||
        target.closest('input[type="button"]') ||
        target.closest('[data-hover]') ||
        target.closest('.group') ||
        window.getComputedStyle(target).cursor === "pointer";

      const isTextEntry =
        target.closest('input[type="text"]') ||
        target.closest('input[type="email"]') ||
        target.closest('input[type="search"]') ||
        target.closest("textarea");

      if (isInteractive) {
        setHoverType("interactive");
      } else if (isTextEntry) {
        setHoverType("text");
      } else {
        setHoverType("default");
      }
    };

    window.addEventListener("pointermove", moveCursor);
    document.addEventListener("pointerenter", handleMouseEnter);
    document.addEventListener("pointerleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("pointermove", moveCursor);
      document.removeEventListener("pointerenter", handleMouseEnter);
      document.removeEventListener("pointerleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Disable completely on touch devices or systems opting for reduced motion
  if (isTouchDevice || prefersReducedMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block overflow-hidden">
          {/* Dynamic Outer Ring / Rotating Celestial Emblem */}
          <motion.div
            className="absolute top-0 left-0 flex items-center justify-center z-[9998]"
            style={{
              x: springXOuter,
              y: springYOuter,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{
                scale: hoverType === "interactive" ? 1.2 : isClicking ? 0.8 : 1,
                rotate: hoverType === "interactive" ? [0, 360] : 0,
              }}
              transition={{
                scale: { type: "spring", damping: 20, stiffness: 300 },
                rotate: { repeat: Infinity, duration: 15, ease: "linear" }
              }}
              className="relative w-16 h-16 flex items-center justify-center"
            >
              {/* Fallback Outer Circle */}
              <motion.div
                animate={{
                  opacity: hoverType === "default" ? 0.3 : 0,
                  scale: isClicking ? 0.7 : 1,
                }}
                className="absolute w-8 h-8 rounded-full border border-platinum/40"
              />

              {/* High-End Celestial Emblem / Rotating Artifact (revealed on interactive hover) */}
              <AnimatePresence>
                {hoverType === "interactive" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <svg
                      width="54"
                      height="54"
                      viewBox="0 0 54 54"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-[0_0_8px_rgba(183,110,121,0.5)]"
                    >
                      {/* Compass Circle */}
                      <circle cx="27" cy="27" r="16" stroke="var(--color-rosegold, #B76E79)" strokeWidth="0.75" strokeDasharray="3 3" />
                      
                      {/* Platinum Ticks */}
                      <line x1="27" y1="2" x2="27" y2="10" stroke="var(--color-platinum, #D9D9D9)" strokeWidth="0.75" />
                      <line x1="27" y1="44" x2="27" y2="52" stroke="var(--color-platinum, #D9D9D9)" strokeWidth="0.75" />
                      <line x1="2" y1="27" x2="10" y2="27" stroke="var(--color-platinum, #D9D9D9)" strokeWidth="0.75" />
                      <line x1="44" y1="27" x2="52" y2="27" stroke="var(--color-platinum, #D9D9D9)" strokeWidth="0.75" />
                      
                      {/* Celestial Star points */}
                      <path d="M27 15 L28.5 24.5 L38 26 L28.5 27.5 L27 37 L25.5 27.5 L16 26 L25.5 24.5 Z" fill="rgba(183, 110, 121, 0.25)" stroke="var(--color-rosegold, #B76E79)" strokeWidth="0.75" />

                      {/* Center Golden core dot */}
                      <circle cx="27" cy="27" r="1.5" fill="#dcc57b" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Inner Precise Core Pointer (ultra-responsive pointer dot / crosshair / text I-beam) */}
          <motion.div
            className="absolute top-0 left-0 flex items-center justify-center z-[9999]"
            style={{
              x: springXInner,
              y: springYInner,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <motion.div
              animate={{
                scale: isClicking ? 0.9 : 1,
              }}
              transition={{ type: "spring", damping: 15, stiffness: 400 }}
              className="flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {hoverType === "default" && (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Delicate hair-thin architectural axes in Platinum */}
                      <line x1="16" y1="4" x2="16" y2="28" stroke="rgba(217, 217, 217, 0.25)" strokeWidth="0.5" />
                      <line x1="4" y1="16" x2="28" y2="16" stroke="rgba(217, 217, 217, 0.25)" strokeWidth="0.5" />

                      {/* Center focus indicator in Rose Gold */}
                      <rect x="14.5" y="14.5" width="3" height="3" transform="rotate(45 16 16)" fill="var(--color-rosegold, #B76E79)" />
                    </svg>
                  </motion.div>
                )}

                {hoverType === "text" && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      width="12"
                      height="24"
                      viewBox="0 0 12 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Serif style caret (typewriter) in Platinum */}
                      <line x1="6" y1="4" x2="6" y2="20" stroke="var(--color-platinum, #D9D9D9)" strokeWidth="1" />
                      <line x1="3" y1="4" x2="9" y2="4" stroke="var(--color-platinum, #D9D9D9)" strokeWidth="1" />
                      <line x1="3" y1="20" x2="9" y2="20" stroke="var(--color-platinum, #D9D9D9)" strokeWidth="1" />
                    </svg>
                  </motion.div>
                )}

                {hoverType === "interactive" && (
                  <motion.div
                    key="interactive"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Glowing golden diamond core during interactions */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                      }}
                      className="w-2.5 h-2.5 bg-rosegold transform rotate-45 shadow-[0_0_8px_var(--color-rosegold)] border border-platinum/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}