"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { TransitionLink } from "@/components/system/TransitionProvider";
import { NAV_LINKS } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { SITE_MEDIA } from "@/lib/site-media";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[120] px-6 lg:px-12 py-5 flex items-center justify-between pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-void/85 to-transparent pointer-events-none" />

        <TransitionLink
          href="/"
          className="relative pointer-events-auto font-serif italic text-xl text-ivory tracking-tight"
        >
          KingShadP<span className="text-bronze">.</span>
        </TransitionLink>

        <nav className="relative pointer-events-auto flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <TransitionLink
                key={l.href}
                href={l.href}
                className={`group font-mono text-[10px] tracking-[0.35em] uppercase transition-colors duration-300 ${
                  pathname === l.href ? "text-bronze" : "text-ivory/60 hover:text-ivory"
                }`}
              >
                {l.label}
                <span
                  className={`block h-px mt-1 bg-bronze origin-left transition-transform duration-500 ease-out ${
                    pathname === l.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </TransitionLink>
            ))}
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="font-mono text-[10px] tracking-[0.35em] uppercase text-ivory/80 hover:text-bronze transition-colors duration-300"
          >
            Menu
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && <MenuOverlay onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const links = [{ href: "/", label: "Home", index: "00" }, ...NAV_LINKS];

  return (
    <motion.div
      className="fixed inset-0 z-[160] bg-void flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE } }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Ambient panel — only mounted while the menu is open */}
      <div className="hidden lg:block w-[42%] relative overflow-hidden border-r border-ivory/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_MEDIA.menuBackdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30 saturate-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/60" />
        <p className="absolute bottom-8 left-8 font-mono text-[9px] tracking-[0.4em] uppercase text-ivory/40">
          Music. Image. Story. World.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 md:px-20">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-5 right-6 lg:right-12 font-mono text-[10px] tracking-[0.35em] uppercase text-ivory/70 hover:text-bronze transition-colors"
        >
          Close
        </button>

        <nav className="flex flex-col gap-2">
          {links.map((l, i) => (
            <motion.div
              key={l.href}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: EASE }}
            >
              <TransitionLink
                href={l.href}
                onNavigate={onClose}
                className="group flex items-baseline gap-5 py-3"
              >
                <span className="font-mono text-[10px] text-bronze/70 tracking-[0.3em]">
                  {l.index}
                </span>
                <span className="font-serif italic font-light text-5xl md:text-7xl text-ivory/85 group-hover:text-ivory group-hover:translate-x-2 transition-all duration-500 ease-out">
                  {l.label}
                </span>
              </TransitionLink>
            </motion.div>
          ))}
        </nav>

        <motion.div
          className="mt-16 rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          style={{ transformOrigin: "left" }}
        />
        <motion.p
          className="mt-6 font-mono text-[9px] tracking-[0.4em] uppercase text-ivory/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          KingShadP — Official Archive
        </motion.p>
      </div>
    </motion.div>
  );
}
