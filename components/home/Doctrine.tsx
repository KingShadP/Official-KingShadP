"use client";

import { Reveal } from "@/components/system/Reveal";
import { TransitionLink } from "@/components/system/TransitionProvider";

export function Doctrine() {
  return (
    <section className="relative border-t border-ivory/10">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-32 md:py-44 text-center">
        <Reveal>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bronze mb-10">
            The Ruler Code
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <blockquote className="font-serif italic font-light text-3xl md:text-5xl leading-snug text-ivory/90">
            &ldquo;Own the room. Do not overcrowd it. Let every silence have
            weight. Let the standard speak before the mouth does.&rdquo;
          </blockquote>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="rule w-40 mx-auto mt-12 mb-10" />
          <TransitionLink
            href="/world"
            className="font-mono text-[10px] tracking-[0.35em] uppercase text-ivory/50 hover:text-bronze transition-colors duration-300"
          >
            Read the World →
          </TransitionLink>
        </Reveal>
      </div>
    </section>
  );
}
