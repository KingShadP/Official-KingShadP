"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/system/TransitionProvider";
import { NAV_LINKS } from "@/lib/content";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-[120] px-4 md:px-6 lg:px-12 py-5 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/65 to-transparent pointer-events-none" />
      <div className="relative pointer-events-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <TransitionLink
          href="/"
          className="font-serif italic text-xl text-ivory tracking-tight w-fit"
        >
          KingShadP<span className="text-bronze">.</span>
        </TransitionLink>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 md:justify-end">
          {NAV_LINKS.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className={`group font-mono text-[10px] tracking-[0.35em] uppercase transition-colors duration-300 ${
                pathname === link.href ? "text-bronze" : "text-ivory/60 hover:text-ivory"
              }`}
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

  // Lock scroll and close on Escape while open.
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

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
        <video
          src="/Model_wearing_KingShadP_hoodie_202605270727.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35 saturate-50"
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
              {link.label}
              <span
                className={`block h-px mt-1 bg-bronze origin-left transition-transform duration-500 ease-out ${
                  pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </TransitionLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
