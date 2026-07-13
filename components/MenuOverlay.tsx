"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function MenuOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [lang, setLang] = useState<"EN" | "IT" | "DE">("EN");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!isOpen && dialog && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Focus trap is mostly handled natively by <dialog>, but we can ensure it is robust
  // and close on ESC.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.dialog
          ref={dialogRef}
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 w-full h-full max-w-none max-h-none p-0 m-0 bg-void text-ivory backdrop:bg-transparent overflow-hidden"
          onClose={onClose}
        >
          {/* Header Area Inside Dialog */}
          <div className="absolute top-0 left-0 right-0 p-6 lg:p-10 flex justify-between items-start z-20 pointer-events-none">
            <div className="flex flex-col gap-1">
              <div 
                className="font-serif text-2xl text-ivory font-light italic tracking-tight opacity-90 pointer-events-auto cursor-pointer"
                onClick={onClose}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onClose()}
              >
                KingShadP<span className="text-oxblood drop-shadow-[0_0_8px_rgba(147,0,10,0.8)]">.</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-ivory font-mono text-xs tracking-widest uppercase hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold pointer-events-auto"
              aria-label="Close menu"
            >
              [ Close ]
            </button>
          </div>

          <div className="w-full h-full flex flex-col md:flex-row">
            {/* Left side: Large video/image */}
            <div className="hidden md:block w-3/5 h-full relative overflow-hidden bg-void/50">
              <video
                src="/Model_wearing_KingShadP_hoodie_202605270727.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover filter contrast-[1.1] saturate-50 brightness-[0.85] opacity-50"
              />
              <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none" />
            </div>

            {/* Right side: Asymmetrical nav links */}
            <div className="flex-1 h-full flex flex-col justify-center px-8 lg:px-24 pt-32 pb-24 border-l border-ivory/10">
              <nav className="flex flex-col gap-6 md:gap-8 relative z-10 w-full md:items-end md:text-right">
                <Link
                  href="/"
                  onClick={onClose}
                  className="font-serif text-4xl lg:text-5xl font-light italic text-ivory hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold group"
                >
                  <span className="text-xs font-mono tracking-widest text-oxblood mr-4 opacity-50 group-hover:opacity-100 uppercase align-middle">01</span>
                  Sovereign Home
                </Link>
                <Link
                  href="/music"
                  onClick={onClose}
                  className="font-serif text-4xl lg:text-5xl font-light italic text-ivory hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold group"
                >
                  <span className="text-xs font-mono tracking-widest text-oxblood mr-4 opacity-50 group-hover:opacity-100 uppercase align-middle">02</span>
                  The Sonic Vault
                </Link>
                <Link
                  href="/archive"
                  onClick={onClose}
                  className="font-serif text-4xl lg:text-5xl font-light italic text-ivory hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold group"
                >
                  <span className="text-xs font-mono tracking-widest text-oxblood mr-4 opacity-50 group-hover:opacity-100 uppercase align-middle">03</span>
                  Classified Archive
                </Link>
                <Link
                  href="/fashion"
                  onClick={onClose}
                  className="font-serif text-4xl lg:text-5xl font-light italic text-ivory hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold group"
                >
                  <span className="text-xs font-mono tracking-widest text-oxblood mr-4 opacity-50 group-hover:opacity-100 uppercase align-middle">04</span>
                  Garment Lookbook
                </Link>
                <Link
                  href="/campaigns"
                  onClick={onClose}
                  className="font-serif text-4xl lg:text-5xl font-light italic text-ivory hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold group"
                >
                  <span className="text-xs font-mono tracking-widest text-oxblood mr-4 opacity-50 group-hover:opacity-100 uppercase align-middle">05</span>
                  Creative Vision
                </Link>
                <Link
                  href="/acquisition"
                  onClick={onClose}
                  className="font-serif text-4xl lg:text-5xl font-light italic text-ivory hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold group"
                >
                  <span className="text-xs font-mono tracking-widest text-oxblood mr-4 opacity-50 group-hover:opacity-100 uppercase align-middle">06</span>
                  Asset Hub
                </Link>
                <Link
                  href="/about"
                  onClick={onClose}
                  className="font-serif text-4xl lg:text-5xl font-light italic text-ivory hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold group"
                >
                  <span className="text-xs font-mono tracking-widest text-oxblood mr-4 opacity-50 group-hover:opacity-100 uppercase align-middle">07</span>
                  About Studio
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="font-serif text-4xl lg:text-5xl font-light italic text-ivory hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold group"
                >
                  <span className="text-xs font-mono tracking-widest text-oxblood mr-4 opacity-50 group-hover:opacity-100 uppercase align-middle">08</span>
                  Concierge Contact
                </Link>
              </nav>

              {/* Language Toggle with large touch targets */}
              <div className="mt-auto pt-16 flex justify-end gap-2">
                {(["EN", "IT", "DE"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    aria-label={`Switch language to ${l}`}
                    aria-pressed={lang === l}
                    className={`min-w-[44px] min-h-[44px] flex items-center justify-center font-mono text-xs tracking-widest ${
                      lang === l ? "text-gold border-b border-gold" : "text-ivory/50 hover:text-ivory"
                    } transition-colors focus:outline-none focus:ring-2 focus:ring-gold`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
}
