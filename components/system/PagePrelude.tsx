"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type PagePreludeProps = {
  pageKey: string;
  bootLabel: string;
  heading: string;
  body: string;
  enterLabel?: string;
  backdropSrc?: string;
  children: React.ReactNode;
};

export function PagePrelude({
  pageKey,
  bootLabel,
  heading,
  body,
  enterLabel = "Enter",
  backdropSrc,
  children,
}: PagePreludeProps) {
  const [stage, setStage] = useState<"boot" | "disclaimer" | "ready">("boot");

  useEffect(() => {
    const timer = window.setTimeout(() => setStage("disclaimer"), 1100);
    return () => window.clearTimeout(timer);
  }, [pageKey]);

  return (
    <div className="relative">
      {children}

      <AnimatePresence mode="wait">
        {stage === "boot" ? (
          <motion.div
            key={`${pageKey}-boot`}
            className="fixed inset-0 z-[240] flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="font-serif text-4xl md:text-6xl tracking-[0.2em] uppercase text-ivory/90"
              initial={{ opacity: 0, letterSpacing: "0.45em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ duration: 0.9 }}
            >
              {bootLabel}
            </motion.span>
          </motion.div>
        ) : null}

        {stage === "disclaimer" ? (
          <motion.div
            key={`${pageKey}-disclaimer`}
            className="fixed inset-0 z-[240] flex items-center justify-center bg-black/95 px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {backdropSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={backdropSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
                />
                <div className="absolute inset-0 bg-black/88" />
              </>
            ) : null}
            <div className="relative z-10 max-w-2xl">
              <p className="mb-5 font-mono text-[10px] tracking-[0.4em] uppercase text-bronze">{bootLabel}</p>
              <h1 className="mb-6 font-serif text-4xl md:text-6xl font-light text-ivory">{heading}</h1>
              <p className="mb-10 font-serif text-lg md:text-xl font-light leading-relaxed text-ivory/70">{body}</p>
              <button
                type="button"
                onClick={() => setStage("ready")}
                className="border border-bronze/45 px-8 py-4 font-mono text-[10px] uppercase tracking-[0.35em] text-bronze transition-colors hover:border-bronze hover:bg-bronze/10"
              >
                {enterLabel}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
