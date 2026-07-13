"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, HelpCircle } from "lucide-react";

export default function TermsPage() {
  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="flex flex-col gap-12 mt-6 max-w-4xl mx-auto text-left leading-relaxed">
      
      <div className="border-b border-[#dcc57b]/20 pb-8 flex flex-col gap-3">
        <span className="font-mono text-[9px] text-[#93000a] font-bold tracking-[0.2em] uppercase">{"// LEGAL FRAMEWORK"}</span>
        <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight font-light">
          Terms of Service.
        </h1>
        <p className="font-sans text-xs text-white/50 font-mono tracking-widest uppercase">
          LAST MODIFIED: JULY 13, 2026 // COVENANT SYSTEM v1.8 // SECURE LEDGER
        </p>
      </div>

      <div className="flex items-start gap-4 bg-[#0c0a09]/50 border border-[#dcc57b]/20 p-6 rounded-xl">
        <Scale className="w-8 h-8 text-[#dcc57b] shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-white font-bold uppercase tracking-wider">THE COVENANT MATRIX</span>
          <p className="font-sans text-sm text-white/70 font-light">
            By entering this orbit, streaming our frequencies, or initiating a garment acquisition protocol, you consent to honor the branding, nomenclature, and design constraints defined in our Master Brand Intelligence index.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 font-sans text-sm text-white/70 font-light leading-relaxed">
        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">1. Nomenclature Integrity</h3>
          <p>
            You agree never to refer to this platform, its creative outputs, or its operator as King Shad P, Kingshadp, ShadP, or other unapproved variations. The spelling must remain strictly <strong className="text-white font-semibold">KingShadP</strong>, keeping letters intact under all publishing coordinates.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">2. Acquisition Protocol</h3>
          <p>
            Submitted apparel orders act as direct commission requests. You are responsible for providing precise physical delivery details and active email coords. Payment processing occurs through secure offline channels. Sizing metrics are precisely mapped to our portuguess-cotton specifications; returns are evaluated strictly within 14 Earth days of receipt under perfect security seals.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">3. Intellectual Property Licenses</h3>
          <p>
            Soundwave streams and ambient synth drone coordinates are registered master works. Mechanical sync licensing, virtual world asset files, and pattern technology blueprints require formal acquisition codes obtained via our dedicated Professional Inquiry gateway.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">4. Boundary Enforcement</h3>
          <p>
            We enforce a zero-tolerance policy against injection scripts, automated coordinate scraping, and database manipulation attempts. Violations of server-side protocols trigger immediate gateway lockdown.
          </p>
        </div>
      </div>

    </motion.div>
  );
}
