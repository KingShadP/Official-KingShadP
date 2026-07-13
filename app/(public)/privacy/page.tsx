"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu } from "lucide-react";

export default function PrivacyPage() {
  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="flex flex-col gap-12 mt-6 max-w-4xl mx-auto text-left leading-relaxed">
      
      <div className="border-b border-[#dcc57b]/20 pb-8 flex flex-col gap-3">
        <span className="font-mono text-[9px] text-[#93000a] font-bold tracking-[0.2em] uppercase">{"// SECURITY PROTOCOL"}</span>
        <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight font-light">
          Privacy Policy.
        </h1>
        <p className="font-sans text-xs text-white/50 font-mono tracking-widest uppercase">
          LAST MODIFIED: JULY 13, 2026 // VERSION: 1.0.4 // ENCRYPTED NODE ARCHIVE
        </p>
      </div>

      <div className="flex items-start gap-4 bg-[#0c0a09]/50 border border-[#dcc57b]/20 p-6 rounded-xl">
        <ShieldCheck className="w-8 h-8 text-[#dcc57b] shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-white font-bold uppercase tracking-wider">THE SOVEREIGN DATA DOCTRINE</span>
          <p className="font-sans text-sm text-white/70 font-light">
            We value individual human souls. We do not engage in pixel tracking, silent analytical advertising, or the monetisation of coordinate identifiers. Your transactions and inquiries live inside an encrypted, private database ledger.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 font-sans text-sm text-white/70 font-light font-sans leading-relaxed">
        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">1. Transmission Elements</h3>
          <p>
            When registering an inquiry or module acquisition, our system stores coordinator names, active email communications, physical delivery addresses, and custom instructions securely. This data is utilized solely for fulfillment telemetry and direct contact coordinates.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">2. Ledger Integrity</h3>
          <p>
            All submitted values undergo security checks and checksum calculations. We do not distribute database slices to marketing aggregators. Database tables are purged periodically to maintain absolute minimal tracking weight.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">3. Cookie Declaration</h3>
          <p>
            Our portal does not deploy non-functional behavioral cookies. We utilize native browser <code className="font-mono text-xs text-[#dcc57b] bg-white/5 px-1 rounded">localStorage</code> solely to persist ambient sound settings, system boot-loader state, and transaction tracking keys.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-2xl text-white font-light italic">4. Operator Contact</h3>
          <p>
            To purge your stored ledger information or query existing records, please submit a communication package through our general Contact panel requesting data clearance under the G-SEC-42 Protocol.
          </p>
        </div>
      </div>

    </motion.div>
  );
}
