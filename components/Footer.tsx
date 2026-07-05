import { TransitionLink } from "@/components/system/TransitionProvider";
import { BRAND } from "@/config/brand.config";
import { NAV_LINKS } from "@/config/site.config";

/** CORE chrome — all strings and links come from config. */
export function Footer() {
  return (
    <footer className="relative w-full border-t border-ivory/10 bg-void">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 flex flex-col md:flex-row justify-between gap-10">
        <div className="flex flex-col gap-3">
          <span className="font-serif italic text-2xl font-light text-ivory/90">
            {BRAND.wordmark.text}
            <span className="text-bronze">{BRAND.wordmark.accent}</span>
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-ivory/35">
            {BRAND.tagline}
          </span>
        </div>

        <nav className="flex items-start gap-8">
          {NAV_LINKS.map((l) => (
            <TransitionLink
              key={l.href}
              href={l.href}
              className="font-mono text-[10px] tracking-[0.3em] uppercase text-ivory/50 hover:text-bronze transition-colors duration-300"
            >
              {l.label}
            </TransitionLink>
          ))}
        </nav>

        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ivory/30 md:text-right">
          {BRAND.copyrightLine}
          <br />
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
