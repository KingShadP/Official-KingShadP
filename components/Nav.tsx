"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/system/TransitionProvider";
import { BRAND } from "@/config/brand.config";
import { NAV_LINKS } from "@/config/site.config";

/**
 * CORE chrome — wordmark + inline nav. Links and brand strings come from
 * config; this component contains no instance-specific values.
 */
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
          {BRAND.wordmark.text}
          <span className="text-bronze">{BRAND.wordmark.accent}</span>
        </TransitionLink>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-end">
          {NAV_LINKS.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className={`group font-mono text-[10px] tracking-[0.35em] uppercase transition-colors duration-300 ${
                pathname === link.href
                  ? "text-bronze"
                  : "text-ivory/60 hover:text-ivory"
              }`}
            >
              {link.label}
              <span
                className={`block h-px mt-1 bg-bronze origin-left transition-transform duration-500 ease-out ${
                  pathname === link.href
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </TransitionLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
