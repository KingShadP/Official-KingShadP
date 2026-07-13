"use client";
import { useState, memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MenuOverlay } from "./MenuOverlay";

export const Nav = memo(function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header id="main-header" className="fixed top-0 left-0 right-0 z-40 bg-[#0c0a09]/60 backdrop-blur-md border-b border-[#dcc57b]/20 px-6 lg:px-12 py-5 flex justify-between items-center">
        <div className="flex flex-col">
          <Link 
            href="/" 
            className="font-serif text-xl tracking-[0.2em] uppercase font-light text-white hover:text-[#dcc57b] transition-colors"
          >
            KING SHAD P
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav id="top-navigation" className="hidden md:flex items-center gap-6 md:gap-10">
          {[
            { label: "Home", path: "/" },
            { label: "Music", path: "/music" },
            { label: "Lookbook", path: "/fashion" },
            { label: "Archive", path: "/archive" },
            { label: "Manifesto", path: "/campaigns" },
            { label: "Inquire", path: "/contact" },
            { label: "Search", path: "/search" }
          ].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
                pathname === item.path
                  ? "text-[#dcc57b] font-semibold border-b border-[#dcc57b] pb-0.5"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Trigger Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex items-center font-mono text-[10px] uppercase tracking-widest text-[#dcc57b] border border-[#dcc57b]/30 px-3 py-1.5 rounded-sm hover:text-white hover:border-white transition-colors"
          aria-label="Open navigation menu"
        >
          [ MENU ]
        </button>
      </header>

      {/* Render the full screen menu overlay */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
});

