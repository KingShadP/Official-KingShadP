"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, CheckCircle } from "lucide-react";

export default function AccessibilityPage() {
  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="flex flex-col gap-12 mt-6 max-w-4xl mx-auto text-left leading-relaxed">
      
      <div className="border-b border-[#dcc57b]/20 pb-8 flex flex-col gap-3">
        <span className="font-mono text-[9px] text-[#93000a] font-bold tracking-[0.2em] uppercase">{"// CONFORMANCE STANDARDS"}</span>
        <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight font-light">
          Accessibility Statement.
        </h1>
        <p className="font-sans text-xs text-white/50 font-mono tracking-widest uppercase">
          WCAG 2.1 AA COMPLIANT // COGNITIVE ACCESSIBILITY CORE // MOTION CONTROLS
        </p>
      </div>

      <div className="flex items-start gap-4 bg-[#0c0a09]/50 border border-[#dcc57b]/20 p-6 rounded-xl">
        <Eye className="w-8 h-8 text-[#dcc57b] shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-white font-bold uppercase tracking-wider">EQUAL DIGNITY INDEX</span>
          <p className="font-sans text-sm text-white/70 font-light">
            We hold that all human souls share equal, sacred, infinite worth. We design our digital flagship with extreme visual care, implementing high text contrast, scalable serif weights, keyboard focus boundaries, and responsive screen-reader compatibility.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 font-sans text-sm text-white/70 font-light leading-relaxed">
        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">1. Readability & Color Contrast</h3>
          <p>
            Text layouts are set against a solid Ink Black (#090908) backdrop with Ivory (#f4ecd8) and Champagne Gold (#dcc57b) color values. Color contrasts exceed WCAG 2.1 AA ratios of 4.5:1 for standard body text, ensuring legibility for all visitors.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">2. Interactive Motion Restraint</h3>
          <p>
            Animations utilize Framer Motion&apos;s <code className="font-mono text-xs text-[#dcc57b] bg-white/5 px-1 rounded">useReducedMotion</code> state checks. Visitors with motion sensitivities who configure &quot;Reduce Motion&quot; parameters in their operating systems will experience clean, non-distracting instant transitions instead of sliding or scaling transformations.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">3. Keyboard and Screen Navigation</h3>
          <p>
            All acquisition overlays, portal dropdowns, and text form matrices support full keyboard focus indicators (<code className="font-mono text-xs text-[#dcc57b] bg-white/5 px-1 rounded">outline-none focus:ring-1 focus:ring-[#dcc57b]</code>), semantic HTML markup elements, and aria-labels for fluid screen reader navigation.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">4. Constant Feedback</h3>
          <p>
            If you encounter visual barriers, navigation blocks, or audio feedback issues on our platform, please submit a communication package so we can execute immediate corrective schema updates.
          </p>
        </div>
      </div>

    </motion.div>
  );
}
