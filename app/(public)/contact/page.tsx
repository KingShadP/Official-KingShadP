"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    organization: "",
    topic: "collaboration",
    message: ""
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setContactSubmitted(true);
        setContactForm({ name: "", email: "", organization: "", topic: "collaboration", message: "" });
      } else {
        setErrorMsg(data.error || "Transmission failed.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to reach server node.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="flex flex-col lg:flex-row gap-16 mt-6 items-start">
      <div className="flex-1 flex flex-col gap-6 text-left">
        <div className="font-mono text-[10px] text-[#93000a] uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#93000a]" />
          <span>SOVEREIGN COMMUNICATIONS LAYER</span>
        </div>
        
        <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight font-light">
          Inquire.
        </h1>

        <p className="font-sans text-base text-white/70 font-light leading-relaxed max-w-xl">
          We process direct commissions, auditory sync licensing, and strategic garment distributions under strict guidelines. If your path aligns with our structural priorities, our administrative core will open a dedicated orbital gateway.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#dcc57b]/20 pt-8 mt-4 font-mono text-[10px] text-white/40">
          <div className="flex flex-col gap-1">
            <span>TRANSMISSION:</span>
            <span className="text-[#dcc57b] font-semibold text-xs uppercase">Encrypted SQL Node</span>
          </div>
          <div className="flex flex-col gap-1">
            <span>RESPONSE TELEMETRY:</span>
            <span className="text-[#dcc57b] font-semibold text-xs uppercase">48-72 Earth Hours</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[480px] shrink-0 border border-[#dcc57b]/20 rounded-xl overflow-hidden p-[1px] bg-[#0c0a09]/60 backdrop-blur-md">
        <div className="p-6 md:p-8 flex flex-col gap-6 text-left">
          <div className="border-b border-[#dcc57b]/20 pb-4">
            <h3 className="font-serif text-2xl text-white font-light italic">Gateway Registration</h3>
            <p className="font-mono text-[8px] text-[#dcc57b] uppercase tracking-widest mt-1">Submit proposal package to CMS repository</p>
          </div>

          {!contactSubmitted ? (
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="text-red-500 font-mono text-[10px] bg-red-950/20 border border-red-900/40 p-3 rounded-lg uppercase">
                  Error: {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Coordinator Name:</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="bg-[#090908]/80 border border-[#dcc57b]/20 font-sans text-xs text-white px-3 py-3 rounded-lg outline-none focus:border-[#dcc57b] transition-colors"
                  placeholder="FULL NAME"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Contact Channel (Email):</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="bg-[#090908]/80 border border-[#dcc57b]/20 font-mono text-xs text-white px-3 py-3 rounded-lg outline-none focus:border-[#dcc57b] transition-colors"
                  placeholder="EMAIL@DOMAIN.COM"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Organization (Optional):</label>
                <input
                  type="text"
                  value={contactForm.organization}
                  onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                  className="bg-[#090908]/80 border border-[#dcc57b]/20 font-sans text-xs text-white px-3 py-3 rounded-lg outline-none focus:border-[#dcc57b] transition-colors"
                  placeholder="ORGANIZATION / ENTITY"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Inquiry Type:</label>
                <select
                  value={contactForm.topic}
                  onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                  className="bg-[#090908]/80 border border-[#dcc57b]/20 font-mono text-xs text-white px-3 py-3 rounded-lg outline-none focus:border-[#dcc57b] transition-colors cursor-pointer"
                >
                  <option value="collaboration">COLLABORATION ORBIT</option>
                  <option value="music">SOUNDTRACK SYNCHRONIZATION</option>
                  <option value="garment">GARMENT PRESS LOOKBOOK</option>
                  <option value="general">GENERAL INFORMATION</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Inquiry details:</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="bg-[#090908]/80 border border-[#dcc57b]/20 font-sans text-sm text-white font-light px-3 py-3 rounded-lg outline-none focus:border-[#dcc57b] transition-colors"
                  placeholder="Describe your project, timeline, or request specifications..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] font-mono text-[10px] tracking-widest uppercase py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold disabled:opacity-50"
              >
                {isSubmitting ? "TRANSMITTING..." : "Submit Inquiry"} <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#dcc57b] animate-pulse" />
              <h4 className="font-serif text-2xl text-white italic font-light">Inquiry Submitted</h4>
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest max-w-[280px] leading-relaxed mt-2">
                Thank you. Your inquiry has been logged in our studio index. We will respond promptly.
              </p>
              <button
                onClick={() => setContactSubmitted(false)}
                className="mt-4 text-[#dcc57b] font-mono text-[9px] uppercase tracking-widest border border-[#dcc57b]/30 px-4 py-2 rounded-lg hover:bg-[#dcc57b]/10 transition-colors"
              >
                [ Send Another ]
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
