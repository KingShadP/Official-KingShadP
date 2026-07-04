"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { SITE_MEDIA } from "@/lib/site-media";

/**
 * Signature bootloader — plays once per session.
 * The KingShadP script mark is revealed left-to-right, as if being signed,
 * over a single hairline. No fake progress bars, no noise.
 */
export function Preloader() {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem("ksp-boot")) return;
    sessionStorage.setItem("ksp-boot", "1");
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setDone(true), reduced ? 600 : 2500);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => {
        document.documentElement.style.overflow = "";
        setShow(false);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [done]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[300] bg-void flex flex-col items-center justify-center"
          exit={{ y: "-100%", transition: { duration: 0.85, ease: EASE } }}
        >
          <div className="relative w-[280px] md:w-[380px]">
            {/* The signature, revealed as if written */}
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.9 }}
              animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
              transition={{ duration: reduced ? 0.3 : 1.7, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
               src={SITE_MEDIA.signature}
                alt="KingShadP"
                className="w-full h-auto select-none pointer-events-none"
                draggable={false}
              />
            </motion.div>
            {/* Hairline underline drawing beneath the mark */}
            <motion.div
              className="absolute -bottom-6 left-0 right-0 rule origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduced ? 0.3 : 1.9, delay: 0.35, ease: EASE }}
            />
          </div>

          <motion.p
            className="absolute bottom-10 font-mono text-[9px] tracking-[0.5em] uppercase text-ivory/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Official Website
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
