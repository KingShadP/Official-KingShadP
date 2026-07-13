"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  CornerDownLeft,
  X,
  RotateCcw,
  AlertTriangle,
  HelpCircle,
  FileText,
  CheckCircle,
  ShieldAlert,
  ChevronRight,
  ArrowRight
} from "lucide-react";

type Action = {
  type: "internal_link" | "inquiry_form" | "escalation";
  label: string;
  href: string;
};

type Source = {
  title: string;
  href: string;
};

type Message = {
  role: "user" | "model";
  content: string;
  actions?: Action[];
  sources?: Source[];
  isError?: boolean;
};

export function ShadowConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  // Inquiry form states
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState<string | null>(null);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  // Accessibility and control refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const SUGGESTED_TRANS_QUESTIONS = [
    { label: "Material Philosophy", text: "Explain the garment specifications and styling of the Platinum Hoodie." },
    { label: "Sizing Calibration", text: "How is the garment sizing calibrated, and what are the exact chest dimensions?" },
    { label: "Dispatch Protocol", text: "Tell me about shipping reliability, delivery tracking, and returns protocol." },
    { label: "Confidence Doctrine", text: "What is the 'You ain't better than me' Confidence Doctrine?" }
  ];

  // 1. Initialize anonymous session and restore conversation from database
  useEffect(() => {
    // Generate secure session ID if missing
    let id = localStorage.getItem("kingshadp_session_id");
    if (!id) {
      id = "orbit_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem("kingshadp_session_id", id);
    }
    setSessionId(id);

    // Initial welcome state
    setMessages([
      {
        role: "model",
        content: "OFFICIAL_INTELLIGENCE: Online. Answering from within KingShadP's secure digital estate. Submit commands or select telemetry directives regarding garment files, audio structures, or shipping coordinates.",
        actions: [
          { type: "internal_link", label: "Inspect Hoodie", href: "/?product=the-platinum-heavy-hoodie" },
          { type: "inquiry_form", label: "Begin Inquiry", href: "?tab=inquiry" }
        ],
        sources: [
          { title: "Brand Vision Document", href: "/?article=king-shad-p-orbit-system" }
        ]
      }
    ]);

    // Handle offline event listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 2. Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Screen reader announcement
    if (liveRegionRef.current && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      liveRegionRef.current.textContent = `${lastMsg.role === "user" ? "You asked" : "System says"}: ${lastMsg.content}`;
    }
  }, [messages]);

  // 3. Close drawer via Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // 4. Focus trapping implementation
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusableElements = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex="0"]'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleClose = () => {
    // Abort active HTTP generate stream if running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsOpen(false);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  // 5. Send message payload to secure API route
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading || isOffline) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputVal("");
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
          anonymousIdentifier: "sovereign_guest"
        }),
        signal: controller.signal
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content: data.message,
            actions: data.actions || [],
            sources: data.sources || []
          }
        ]);
        
        // Auto-show contact form if requested by action triggers
        if (data.actions?.some((act: Action) => act.type === "inquiry_form")) {
          // prefill contact message contextually
          setInquiryMsg(`Inquiry initiated based on orbital coordinates session. Discussing: "${text.substring(0, 100)}..."`);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content: `LATENCY FAILED: Orbital link rejected stream. ${data.message || data.error || "Coordinate out of bounds."}`,
            isError: true
          }
        ]);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content: "SECURITY ALERT: Orbital transmission manually terminated by console supervisor.",
            isError: true
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content: "CRITICAL CHANNEL FAILURE: Cloud SQL link lost or model capacity reached.",
            isError: true
          }
        ]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // 6. Stop current generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // 7. Clear Conversation State
  const handleClearConversation = () => {
    setMessages([
      {
        role: "model",
        content: "OFFICIAL_INTELLIGENCE: Reset executed. All historical telemetry traces in local buffer successfully wiped. Core state is stable. Transmit new coordinate queries below.",
        actions: [
          { type: "internal_link", label: "Inspect Hoodie", href: "/?product=the-platinum-heavy-hoodie" },
          { type: "inquiry_form", label: "Begin Inquiry", href: "?tab=inquiry" }
        ],
        sources: []
      }
    ]);
    setShowInquiryForm(false);
    setInquirySuccess(null);
  };

  // 8. Submit In-Widget Inquiry Form securely to database repo
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMsg.trim() || !consentConfirmed) {
      setInquiryError("Validation Error: All coordinate fields and explicit data consent are required.");
      return;
    }

    setInquiryLoading(true);
    setInquiryError(null);
    setInquirySuccess(null);

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Inquiry Submitted: Name=${inquiryName} Email=${inquiryEmail} Message="${inquiryMsg}"`,
          sessionId: sessionId,
          anonymousIdentifier: "sovereign_guest"
        })
      });

      // Submit actual tool-call styled register to test backend verification
      const promptText = `SYSTEM TRIGGER: Process inquiry form submit. Name: "${inquiryName}", Email: "${inquiryEmail}", Message: "${inquiryMsg}", Consent: ${consentConfirmed}`;
      const actionResponse = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          sessionId: sessionId,
          anonymousIdentifier: "sovereign_guest"
        })
      });

      const actionData = await actionResponse.json();
      if (actionResponse.ok) {
        setInquirySuccess("TRANSMISSION DEPOSITED: Your message has been permanently written to our secure Cloud SQL storage. Verification index recorded.");
        setInquiryName("");
        setInquiryEmail("");
        setInquiryMsg("");
        setConsentConfirmed(false);
        
        // Add success message to chat list
        setMessages(prev => [
          ...prev,
          {
            role: "model",
            content: `INQUIRY DEPOSITED: Sovereign entity ${inquiryName} successfully registered. System logs mapped. Let me know if you need help navigating further garments.`,
            actions: [
              { type: "internal_link", label: "Return Home", href: "/" }
            ]
          }
        ]);
        
        // Delay closing form
        setTimeout(() => setShowInquiryForm(false), 3000);
      } else {
        setInquiryError(actionData.message || "Failed to commit inquiry record to Cloud SQL.");
      }
    } catch (err) {
      setInquiryError("Database write failed. Channel coordinates offline.");
    } finally {
      setInquiryLoading(false);
    }
  };

  // Helper to format line-breaks and markdown bold text safely
  const formatMessageContent = (content: string) => {
    return content.split('\n\n').map((para, i) => {
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="mb-3 leading-relaxed font-sans text-xs text-ivory/85 text-left">
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={idx} className="font-semibold text-gold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launch Control Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          ref={triggerRef}
          onClick={handleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-none border border-oxblood/40 hover:border-gold/40 bg-[#030303] text-ivory flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(147,0,10,0.15)] focus:outline-none focus:ring-1 focus:ring-gold pointer-events-auto cursor-pointer group"
          aria-label="Access Answering Console"
        >
          <Command className="w-5 h-5 text-oxblood group-hover:text-gold transition-colors duration-300 animate-pulse" />
          <span className="text-[7px] font-mono text-ivory/40 tracking-widest mt-1 uppercase font-semibold">
            CONCIERGE
          </span>
        </motion.button>
      </div>

      {/* SR screen reader updates announcement */}
      <div ref={liveRegionRef} aria-live="polite" className="sr-only" />

      {/* Immersive Panel Dialog overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Void Background Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-[#000000] pointer-events-auto"
            />

            {/* Sidebar Dialog Content */}
            <motion.div
              ref={dialogRef}
              onKeyDown={handleTabKey}
              role="dialog"
              aria-modal="true"
              aria-labelledby="concierge-title"
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md md:max-w-lg bg-[#030303] border-l border-ivory/10 flex flex-col select-none shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            >
              {/* Privacy Warning Header Banner */}
              <div className="bg-oxblood/10 border-b border-oxblood/20 px-6 py-2.5 flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-oxblood shrink-0" />
                <span className="font-mono text-[8px] text-ivory/70 uppercase tracking-widest text-left leading-normal">
                  NOTICE: Conversations processing. Retained securely. Do not transmit highly sensitive keys, cards, or identities.
                </span>
              </div>

              {/* Console Header */}
              <div className="p-6 border-b border-ivory/10 flex items-center justify-between bg-void/80">
                <div className="flex flex-col gap-1 text-left">
                  <div className="font-mono text-[8px] text-oxblood font-bold tracking-[0.3em] uppercase">
                    {"// TELEMETRY COGNITION BUFFER"}
                  </div>
                  <h4 id="concierge-title" className="font-serif text-lg text-ivory font-light italic">
                    The Official Intelligence
                  </h4>
                </div>
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={handleClearConversation}
                    className="w-8 h-8 flex items-center justify-center border border-ivory/5 hover:border-oxblood/30 text-ivory/50 hover:text-oxblood transition-all duration-300 rounded cursor-pointer"
                    title="Reset Conversation Data"
                    aria-label="Wipe system buffer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    ref={firstFocusableRef}
                    onClick={handleClose}
                    className="w-8 h-8 flex items-center justify-center border border-ivory/5 hover:border-gold/30 text-ivory/50 hover:text-gold transition-all duration-300 rounded cursor-pointer"
                    aria-label="Terminate secure orbit console link"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* System Offline Warning */}
              {isOffline && (
                <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-2 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 animate-bounce" />
                  <span className="font-mono text-[9px] text-yellow-500 uppercase tracking-wider font-semibold">
                    NETWORK CORRUPTION: Connection offline. Transmissions deferred.
                  </span>
                </div>
              )}

              {/* Inquiry Form or Conversation Area */}
              <div className="flex-1 overflow-hidden relative flex flex-col bg-[#050505]">
                {showInquiryForm ? (
                  /* SECURE INQUIRY FORM PANEL */
                  <div className="absolute inset-0 z-20 bg-[#030303] p-6 overflow-y-auto flex flex-col text-left selection:bg-ivory selection:text-void">
                    <div className="flex justify-between items-center mb-6">
                      <div className="font-mono text-[9px] text-gold tracking-widest uppercase">
                        {"// REGISTRATION VAULT PORTAL"}
                      </div>
                      <button
                        onClick={() => setShowInquiryForm(false)}
                        className="font-mono text-[8px] text-ivory/40 hover:text-gold border border-ivory/10 hover:border-gold/30 px-2.5 py-1 uppercase tracking-widest cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <h5 className="font-serif text-lg text-ivory italic font-light mb-2">
                      Inquiry & Signal Submission
                    </h5>
                    <p className="font-sans text-[11px] text-ivory/60 mb-6 leading-relaxed">
                      This formal query is securely validation-checked and directly compiled into our cloud SQL instance. Your telemetry parameters will match human reviewer channels.
                    </p>

                    {inquirySuccess ? (
                      <div className="border border-green-500/20 bg-green-500/5 p-6 flex flex-col items-center text-center gap-3 my-4">
                        <CheckCircle className="w-8 h-8 text-green-500 animate-pulse" />
                        <span className="font-mono text-xs text-green-500 uppercase tracking-widest font-semibold">
                          SIGNAL COMMITTED SECURELY
                        </span>
                        <p className="font-sans text-[11px] text-ivory/80 leading-relaxed max-w-xs">
                          {inquirySuccess}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4 pointer-events-auto">
                        {inquiryError && (
                          <div className="border border-oxblood/40 bg-oxblood/10 p-3 text-oxblood text-[10px] font-mono uppercase tracking-wider">
                            {inquiryError}
                          </div>
                        )}
                        <div className="flex flex-col gap-1.5">
                          <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">
                            Sovereign Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="NAME OR ALIAS"
                            value={inquiryName}
                            onChange={(e) => setInquiryName(e.target.value)}
                            disabled={inquiryLoading}
                            className="bg-void border border-ivory/10 font-mono text-[10px] text-ivory tracking-widest uppercase px-3 py-2.5 outline-none focus:border-gold/40 transition-colors disabled:opacity-50"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">
                            Secure Address (Email)
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="EMAIL COORDINATES"
                            value={inquiryEmail}
                            onChange={(e) => setInquiryEmail(e.target.value)}
                            disabled={inquiryLoading}
                            className="bg-void border border-ivory/10 font-mono text-[10px] text-ivory tracking-widest px-3 py-2.5 outline-none focus:border-gold/40 transition-colors disabled:opacity-50"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">
                            Transmission Content
                          </label>
                          <textarea
                            rows={4}
                            required
                            placeholder="STATE YOUR PROTOCOLS OR COHESIVE INTERESTS"
                            value={inquiryMsg}
                            onChange={(e) => setInquiryMsg(e.target.value)}
                            disabled={inquiryLoading}
                            className="bg-void border border-ivory/10 font-mono text-[10px] text-ivory tracking-widest px-3 py-2.5 outline-none focus:border-gold/40 transition-colors resize-none disabled:opacity-50"
                          />
                        </div>

                        <div className="flex items-start gap-2.5 mt-2">
                          <input
                            id="consent"
                            type="checkbox"
                            required
                            checked={consentConfirmed}
                            onChange={(e) => setConsentConfirmed(e.target.checked)}
                            disabled={inquiryLoading}
                            className="w-4 h-4 accent-gold cursor-pointer shrink-0 mt-0.5"
                          />
                          <label htmlFor="consent" className="font-mono text-[8px] text-ivory/50 uppercase tracking-widest leading-relaxed">
                            I explicitly confirm consent to record this transmission securely into the private KingShadP database vault (v1).
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={inquiryLoading || !consentConfirmed}
                          className="bg-gold/10 hover:bg-gold/20 text-gold font-mono text-[9px] tracking-widest uppercase py-3 border border-gold/30 hover:border-gold transition-all cursor-pointer mt-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                          {inquiryLoading ? "COMMITING SIGNAL VECTOR..." : "TRANSMIT INQUIRY PROTOCOL"}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  /* CONVERSATION HISTORY AREA */
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 selection:bg-ivory selection:text-void scroll-smooth"
                  >
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col gap-2 w-full max-w-[85%] text-left ${
                          m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-ivory/30">
                          {m.role === "user" ? "guest_entity" : "official_intelligence"}
                        </span>
                        
                        <div
                          className={`font-sans text-xs font-light p-4 leading-relaxed border select-text ${
                            m.role === "user"
                              ? "bg-ivory/5 border-ivory/10 text-ivory/95"
                              : m.isError
                              ? "bg-oxblood/10 border-oxblood/30 text-oxblood"
                              : "bg-void border-ivory/5 text-ivory/90"
                          }`}
                        >
                          {formatMessageContent(m.content)}

                          {/* Render Structured actions if model returned them */}
                          {m.actions && m.actions.length > 0 && (
                            <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-ivory/5 pointer-events-auto">
                              <span className="font-mono text-[7px] text-ivory/30 tracking-widest uppercase">
                                RECOMMENDED DIRECTIVES:
                              </span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {m.actions.map((act, actIdx) => (
                                  <button
                                    key={actIdx}
                                    onClick={() => {
                                      if (act.type === "inquiry_form") {
                                        setShowInquiryForm(true);
                                      } else {
                                        window.location.href = act.href;
                                      }
                                    }}
                                    className="font-mono text-[8px] uppercase tracking-wider bg-ivory/5 hover:bg-gold/10 text-ivory/80 hover:text-gold border border-ivory/10 hover:border-gold/40 px-2.5 py-1.5 transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>{act.label}</span>
                                    <ChevronRight className="w-2.5 h-2.5" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Render Factual reference sources */}
                          {m.sources && m.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-ivory/5 flex flex-col gap-1.5 text-left pointer-events-auto">
                              <span className="font-mono text-[7px] text-ivory/30 tracking-widest uppercase">
                                SECURED REFERENCES:
                              </span>
                              <div className="flex flex-wrap gap-2.5">
                                {m.sources.map((src, srcIdx) => (
                                  <a
                                    key={srcIdx}
                                    href={src.href}
                                    className="font-mono text-[8px] text-gold/60 hover:text-gold flex items-center gap-1 hover:underline cursor-pointer"
                                  >
                                    <FileText className="w-2.5 h-2.5 shrink-0" />
                                    <span>{src.title}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Active Loading state display */}
                    {isLoading && (
                      <div className="flex flex-col gap-2 w-full max-w-[85%] mr-auto items-start">
                        <span className="font-mono text-[7px] uppercase tracking-widest text-ivory/30">
                          official_intelligence
                        </span>
                        <div className="font-mono text-[8px] p-4 border bg-[#050505] border-oxblood/10 text-gold flex items-center gap-3">
                          <span className="h-1.5 w-1.5 bg-oxblood rounded-full animate-ping shrink-0" />
                          <span className="tracking-[0.15em] uppercase">
                            DECRYPTING DATABASE TELEMETRY PROTOCOL...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Suggestions Overlay Tray */}
              {!showInquiryForm && (
                <div className="px-6 py-4 border-t border-ivory/5 bg-void/30 flex flex-col gap-2 text-left shrink-0">
                  <span className="font-mono text-[7px] text-ivory/30 uppercase tracking-[0.2em]">
                    MAPPED COGNITIVE CONSOLE PROTOCOLS:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                    {SUGGESTED_TRANS_QUESTIONS.map((cmd, i) => (
                      <button
                        key={i}
                        disabled={isLoading || isOffline}
                        onClick={() => handleSendMessage(cmd.text)}
                        className="font-mono text-[8px] uppercase tracking-wider px-2.5 py-1.5 border border-ivory/15 bg-[#080808] hover:border-gold/30 hover:bg-gold/5 text-ivory/60 hover:text-gold transition-all duration-200 disabled:opacity-30 cursor-pointer"
                      >
                        {cmd.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Command Input Panel */}
              <div className="p-6 border-t border-ivory/10 bg-[#020202] shrink-0">
                {!showInquiryForm ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(inputVal);
                    }}
                    className="flex gap-3 items-stretch pointer-events-auto"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="TRANSMIT COORDINATE COMMAND..."
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      disabled={isLoading || isOffline}
                      className="flex-1 bg-[#030303] border border-ivory/10 font-mono text-[9px] text-ivory uppercase tracking-widest px-4 py-3.5 outline-none focus:border-oxblood/60 transition-colors disabled:opacity-35 min-h-[44px]"
                    />
                    {isLoading ? (
                      <button
                        type="button"
                        onClick={handleStopGeneration}
                        className="bg-oxblood/10 hover:bg-oxblood/20 text-oxblood font-mono text-[9px] tracking-widest uppercase px-4 py-3.5 border border-oxblood/40 hover:border-oxblood transition-all cursor-pointer min-h-[44px]"
                        aria-label="Terminate decryption stream"
                      >
                        STOP
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading || !inputVal.trim() || isOffline}
                        className="bg-oxblood/20 hover:bg-oxblood/60 text-ivory font-mono text-[9px] tracking-widest uppercase px-5 py-3.5 border border-oxblood/30 hover:border-gold/30 transition-all cursor-pointer disabled:opacity-30 min-h-[44px] flex items-center justify-center"
                        aria-label="Transmit channel message"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>
                ) : (
                  <div className="flex justify-between items-center pointer-events-auto">
                    <span className="font-mono text-[7px] text-ivory/30 uppercase tracking-widest">
                      INQUIRY GATEWAY (v1)
                    </span>
                    <button
                      onClick={() => setShowInquiryForm(false)}
                      className="font-mono text-[8px] text-gold uppercase tracking-wider hover:underline py-1.5 px-3 border border-gold/20 hover:border-gold cursor-pointer"
                    >
                      Return to Answering Channel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
