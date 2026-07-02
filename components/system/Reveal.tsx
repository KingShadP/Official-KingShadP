"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";
import type { ReactNode } from "react";

/** Subtle scroll-triggered reveal — the only scroll-fade in the system. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: DUR.base, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
