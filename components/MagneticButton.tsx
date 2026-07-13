"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

export function MagneticButton({
  children,
  onClick,
  className = "",
  id = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const dX = clientX - centerX;
    const dY = clientY - centerY;

    // Pull intensity max 18px
    setPosition({ x: dX * 0.35, y: dY * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const springX = useSpring(position.x, { damping: 15, stiffness: 150 });
  const springY = useSpring(position.y, { damping: 15, stiffness: 150 });

  React.useEffect(() => {
    springX.set(position.x);
    springY.set(position.y);
  }, [position, springX, springY]);

  return (
    <motion.button
      ref={ref}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: shouldReduceMotion ? 0 : springX,
        y: shouldReduceMotion ? 0 : springY,
      }}
      className={`relative select-none pointer-events-auto transition-colors duration-200 outline-none ${className}`}
    >
      {children}
    </motion.button>
  );
}
