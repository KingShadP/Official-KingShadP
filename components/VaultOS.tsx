"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  ShieldAlert, ShieldCheck, Cpu, Volume2, VolumeX, List, Terminal, 
  Activity, Play, Pause, Save, Trash2, KeyRound, CornerDownLeft, 
  Settings, Zap, Sparkles, Orbit, Crosshair, Compass, Eye
} from "lucide-react";

type VaultLog = {
  id: string;
  timestamp: string;
  title: string;
  sector: string;
  details: string;
  checksum: string;
};

export const VaultOS = memo(function VaultOS() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"security" | "resonance" | "ledger" | "diagnostics">("security");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [overrideError, setOverrideError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Web Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "VAULT OS v1.82 - INTEGRITY SECURE",
    "ENTER 'help' TO VIEW COMMAND MATRIX.",
    "STATUS: DECRYPT_NODE_STANDBY"
  ]);

  // Environmental Sound State (Web Audio API)
  const [isSynthActive, setIsSynthActive] = useState(false);
  const [synthFreq, setSynthFreq] = useState(110); // Default A2 Low Drone
  const [synthWave, setSynthWave] = useState<"sine" | "triangle" | "sawtooth">("sine");
  const [synthVolume, setSynthVolume] = useState(0.25);
  const [resonanceMod, setResonanceMod] = useState(12); // Speed of LFO

  // Ledger state (Durable Persistence via LocalStorage)
  const [userLogs, setUserLogs] = useState<VaultLog[]>([]);
  const [newLog, setNewLog] = useState({ title: "", sector: "SEC-42", details: "" });

  // Page Adjustment States (Tweak ambient factors)
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [fogFactor, setFogFactor] = useState(1.0);
  const [perspectiveStrength, setPerspectiveStrength] = useState(1.0);

  // Audio nodes refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodeRef = useRef<OscillatorNode | null>(null);
  const lfoNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasAnimRef = useRef<number | null>(null);

  // Initialize and load persistent logs from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kingshadp_vault_logs");
      if (saved) {
        try {
          setUserLogs(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse logs", e);
        }
      } else {
        const initialLogs: VaultLog[] = [
          {
            id: "log-1",
            timestamp: "2026-06-30 08:12:05",
            title: "Planetary Insertion Orbit",
            sector: "ORBIT-42",
            details: "Entered gravity lock at Sector 42. Stabilized baseline filters at 99.82%. Frequencies verified.",
            checksum: "E91A82-C2"
          },
          {
            id: "log-2",
            timestamp: "2026-06-30 11:42:19",
            title: "Avarice Core Extraction",
            sector: "CORE-ALPHA",
            details: "Extracted gold-embedded marble plate. Transferred telemetry logs safely into deep directory archives.",
            checksum: "F403D5-B8"
          }
        ];
        setUserLogs(initialLogs);
        localStorage.setItem("kingshadp_vault_logs", JSON.stringify(initialLogs));
      }

      // Restore system adjustment defaults
      const savedCrt = localStorage.getItem("kingshadp_crt_enabled");
      if (savedCrt === "true") {
        setCrtEnabled(true);
        document.documentElement.classList.add("crt-scanlines");
      }
    }
  }, []);

  // Sync state to CSS variables on root element for atmospheric adjustments
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--tel-fog-opacity", String(0.15 * fogFactor));
      document.documentElement.style.setProperty("--tel-drift-scale", String(perspectiveStrength));
    }
  }, [fogFactor, perspectiveStrength]);

  // Auto scroll terminal
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalHistory]);

  // Web Audio Synthesizer Controls
  const toggleSynth = () => {
    if (isSynthActive) {
      stopSynth();
    } else {
      startSynth();
    }
  };

  const startSynth = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Primary Gain Node
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0, ctx.currentTime);
      // Fade in to feel heavy/hydraulic
      mainGain.gain.linearRampToValueAtTime(synthVolume, ctx.currentTime + 1.2);
      gainNodeRef.current = mainGain;

      // Lowpass filter for analog, muffled luxury vibe
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(synthFreq * 2.5, ctx.currentTime);
      filter.Q.setValueAtTime(5, ctx.currentTime);
      filterNodeRef.current = filter;

      // Main Oscillator
      const osc = ctx.createOscillator();
      osc.type = synthWave;
      osc.frequency.setValueAtTime(synthFreq, ctx.currentTime);
      oscNodeRef.current = osc;

      // LFO for nice sub-vibrato (Resonance Mod)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(resonanceMod / 6, ctx.currentTime);
      lfoGain.gain.setValueAtTime(5, ctx.currentTime); // 5Hz detuning sway
      
      // Hook up LFO to modulate oscillator frequency
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfoNodeRef.current = lfo;

      // Connect nodes
      osc.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      // Start nodes
      osc.start();
      lfo.start();
      setIsSynthActive(true);

      appendTerminal(`INITIALIZED SOUND RESONANCE AT ${synthFreq}Hz [${synthWave.toUpperCase()}]`);
    } catch (e) {
      console.error("Audio Context Init Failed", e);
    }
  };

  const stopSynth = () => {
    if (audioCtxRef.current && gainNodeRef.current) {
      const ctx = audioCtxRef.current;
      // Fade out slowly
      gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);

      setTimeout(() => {
        try {
          if (oscNodeRef.current) oscNodeRef.current.stop();
          if (lfoNodeRef.current) lfoNodeRef.current.stop();
          if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
            audioCtxRef.current.close();
          }
        } catch (e) {}
        oscNodeRef.current = null;
        lfoNodeRef.current = null;
        gainNodeRef.current = null;
        filterNodeRef.current = null;
        audioCtxRef.current = null;
        setIsSynthActive(false);
        appendTerminal("RESONANCE PROTOCOL SUSPENDED.");
      }, 650);
    }
  };

  // Update live synth nodes
  useEffect(() => {
    if (isSynthActive && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      if (oscNodeRef.current) {
        oscNodeRef.current.frequency.exponentialRampToValueAtTime(synthFreq, ctx.currentTime + 0.5);
      }
      if (filterNodeRef.current) {
        filterNodeRef.current.frequency.exponentialRampToValueAtTime(synthFreq * 2.8, ctx.currentTime + 0.5);
      }
    }
  }, [synthFreq, isSynthActive]);

  useEffect(() => {
    if (isSynthActive && oscNodeRef.current) {
      oscNodeRef.current.type = synthWave;
    }
  }, [synthWave, isSynthActive]);

  useEffect(() => {
    if (isSynthActive && gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(synthVolume, audioCtxRef.current.currentTime);
    }
  }, [synthVolume, isSynthActive]);

  useEffect(() => {
    if (isSynthActive && lfoNodeRef.current) {
      lfoNodeRef.current.frequency.setValueAtTime(resonanceMod / 6, audioCtxRef.current!.currentTime);
    }
  }, [resonanceMod, isSynthActive]);

  // Clean up synth on unmount
  useEffect(() => {
    return () => {
      if (oscNodeRef.current) {
        try {
          oscNodeRef.current.stop();
        } catch (e) {}
      }
      if (lfoNodeRef.current) {
        try {
          lfoNodeRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Waveform Real-time Canvas Rendering
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Create rich dark red background gradient
      const bgGlow = ctx.createLinearGradient(0, 0, 0, height);
      bgGlow.addColorStop(0, "rgba(26, 2, 4, 0.4)");
      bgGlow.addColorStop(1, "rgba(10, 0, 2, 0.6)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Horizontal Center line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(183, 110, 121, 0.1)";
      ctx.lineWidth = 1;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Render actual/simulated waveform based on synth status
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      
      // Beautiful Rose Gold Gradient for the line
      const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
      lineGrad.addColorStop(0, "#b76e79");
      lineGrad.addColorStop(0.5, "#f7d6c8");
      lineGrad.addColorStop(1, "#93000a");
      ctx.strokeStyle = lineGrad;

      const points = 180;
      const amplitude = isSynthActive ? (18 + synthVolume * 25) : 3;
      const waveFreq = isSynthActive ? (synthFreq / 100) : 0.8;
      const speed = isSynthActive ? (0.04 + (resonanceMod * 0.005)) : 0.01;

      phase += speed;

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        
        let sinValue = Math.sin((i / points) * Math.PI * 8 * waveFreq - phase);
        
        // Shape waveform slightly depending on the wave selection
        if (isSynthActive && synthWave === "triangle") {
          sinValue = Math.asin(sinValue) / (Math.PI / 2);
        } else if (isSynthActive && synthWave === "sawtooth") {
          sinValue = 2 * (x / width * waveFreq * 4 - Math.floor(x / width * waveFreq * 4 + 0.5));
        }

        const envelope = Math.sin((i / points) * Math.PI); // Pin ends to zero for beauty
        const y = height / 2 + sinValue * amplitude * envelope;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Ambient scanline overlay inside canvas
      ctx.fillStyle = "rgba(183, 110, 121, 0.04)";
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }

      canvasAnimRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (canvasAnimRef.current) cancelAnimationFrame(canvasAnimRef.current);
    };
  }, [isSynthActive, synthFreq, synthWave, synthVolume, resonanceMod]);

  // Terminal actions helper
  const appendTerminal = (text: string) => {
    setTerminalHistory((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    setTerminalHistory((prev) => [...prev, `> ${terminalInput}`]);
    setTerminalInput("");

    // Command parser
    setTimeout(() => {
      if (cmd === "help") {
        appendTerminal("SUPPORTED SOVEREIGN CORE COMMANDS:");
        appendTerminal(" - decrypt : Trigger security keylock authorization");
        appendTerminal(" - sysinfo : Output high-value aerospace telemetry specs");
        appendTerminal(" - logs    : Review raw environmental logs");
        appendTerminal(" - sound   : Customize active resonance frequencies");
        appendTerminal(" - togglecrt : Force overlay cathode scanlines filter");
        appendTerminal(" - wipe    : Reset local secure ledgers entirely");
        appendTerminal(" - clear   : Flush memory view diagnostics");
      } else if (cmd === "decrypt") {
        if (isUnlocked) {
          appendTerminal("IDENTITY COMPILER LOCKED [CLEARANCE: OMEGA_DECRYPT]");
        } else {
          appendTerminal("PROMPTING SECURITY ENTRY BLOCK - INPUT KEY VALUE ABOVE.");
          setActiveTab("security");
        }
      } else if (cmd === "sysinfo") {
        appendTerminal("SOVEREIGN STATE REPORT:");
        appendTerminal(" - ORBITAL LOCKS: SECTOR_42 (AZIMUTH_STABLE)");
        appendTerminal(" - BASELINE INTEGRITY: 99.82% OPTIMAL");
        appendTerminal(" - DIRECTORY INTEGRATION: ACTIVE VIA SEC_PORT_3000");
        appendTerminal(" - LOCAL TIME: " + new Date().toISOString());
      } else if (cmd === "logs") {
        appendTerminal("DUMPING SHIELD RECORDS...");
        userLogs.forEach((l) => {
          appendTerminal(`[${l.sector}] ${l.title} - CHECKSUM:${l.checksum}`);
        });
      } else if (cmd.startsWith("sound")) {
        const parts = cmd.split(" ");
        if (parts[1]) {
          const freq = parseFloat(parts[1]);
          if (!isNaN(freq) && freq >= 40 && freq <= 1000) {
            setSynthFreq(freq);
            appendTerminal(`FREQUENCY ADJUSTED TO ${freq}Hz.`);
          } else {
            appendTerminal("ERR: FREQUENCY OUT OF BOUNDS (40Hz - 1000Hz REQUIRED).");
          }
        } else {
          appendTerminal("ERR: MISSING ARGUMENT. SPECIFY FREQUENCY (E.G. 'sound 432').");
        }
      } else if (cmd === "togglecrt") {
        toggleCrtFilter();
      } else if (cmd === "wipe") {
        localStorage.removeItem("kingshadp_vault_logs");
        setUserLogs([]);
        appendTerminal("DURABLE LOCAL LEDGERS ERASED completely.");
      } else if (cmd === "clear") {
        setTerminalHistory(["TERMINAL MEMORY CLEANED SUCCESSFULLY."]);
      } else {
        appendTerminal(`COMMAND NOT RECOGNIZED: '${cmd}'. TYPE 'help' FOR CODES.`);
      }
    }, 120);
  };

  // Toggle visual CRT effect globally
  const toggleCrtFilter = () => {
    const isNowCrt = !crtEnabled;
    setCrtEnabled(isNowCrt);
    if (typeof window !== "undefined") {
      localStorage.setItem("kingshadp_crt_enabled", isNowCrt ? "true" : "false");
      if (isNowCrt) {
        document.documentElement.classList.add("crt-scanlines");
        appendTerminal("CRT ANALOG SCANLINE OVERLAY LOCKED ON.");
      } else {
        document.documentElement.classList.remove("crt-scanlines");
        appendTerminal("CRT OVERLAY SUSPENDED.");
      }
    }
  };

  // Credentials unlock
  const handleSecurityUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim().toLowerCase();
    if (clean === "sovereign" || clean === "kingshadp" || clean === "gold") {
      setIsUnlocked(true);
      setOverrideError(false);
      appendTerminal("OVERRIDE AUTHENTICATED. CLEARANCE PROTOCOLS UNLOCKED.");
      setPasswordInput("");
    } else {
      setOverrideError(true);
      appendTerminal("ACCESS REFUSED. CORRUPT OVERRIDE VALUE DETECTED.");
      // Trigger short shaking vibration
      if (navigator.vibrate) {
        navigator.vibrate(120);
      }
    }
  };

  // Write new log to slate
  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.title || !newLog.details) return;

    const created: VaultLog = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      title: newLog.title,
      sector: newLog.sector.toUpperCase(),
      details: newLog.details,
      checksum: Math.random().toString(16).substring(2, 8).toUpperCase() + "-D2"
    };

    const updated = [created, ...userLogs];
    setUserLogs(updated);
    localStorage.setItem("kingshadp_vault_logs", JSON.stringify(updated));
    setNewLog({ title: "", sector: "SEC-42", details: "" });
    appendTerminal(`NEW SYSTEM LOG INSCRIBED: '${created.title}'`);
  };

  // Delete single log
  const handleDeleteLog = (id: string, title: string) => {
    const filtered = userLogs.filter((l) => l.id !== id);
    setUserLogs(filtered);
    localStorage.setItem("kingshadp_vault_logs", JSON.stringify(filtered));
    appendTerminal(`ERASED LOG: '${title}'`);
  };

  // Heavy mechanical slide opening configuration (spring)
  const heavyPanelTransition = {
    type: "spring",
    mass: 2.4,
    damping: 38,
    stiffness: 75
  };

  return (
    <>
      {/* Dynamic Floating HUD activation Badge */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-auto">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-2.5 rounded-sm border border-[#b76e79]/60 bg-gradient-to-r from-[#1c070c] to-[#0c0203] text-gold hover:border-gold shadow-[0_4px_20px_rgba(74,4,10,0.65)] hover:shadow-[0_4px_25px_rgba(183,110,121,0.45)] transition-all "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Subtle pulsator */}
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b76e79] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-oxblood"></span>
          </div>
          
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase font-bold text-ivory/90 group-hover:text-gold transition-colors">
            Vault OS v1.82
          </span>
          <span className="font-mono text-[8px] text-[#b76e79] font-medium opacity-60">
            [ACCESS]
          </span>
        </motion.button>
      </div>

      {/* Main Full-Screen Sovereign Vault OS Console */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto scrollbar-hide select-none"
          >
            {/* Elegant Atmospheric Film Grain inside the interface */}
            <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none" />

            {/* Core Box Container - Styled with Dual Rose-Gold Borders & Velvet Burgundy Shadow Glows */}
            <motion.div
              initial={{ scale: 0.88, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 40 }}
              transition={heavyPanelTransition}
              className="relative w-full max-w-5xl bg-gradient-to-br from-[#120406] via-[#0b0102] to-[#140205] border-2 border-[#b76e79] rounded-md shadow-[0_30px_100px_rgba(59,6,11,0.95)] max-h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Bezel inner metallic accent borders */}
              <div className="absolute inset-0.5 border border-[#b76e79]/30 pointer-events-none rounded-[4px]" />
              <div className="absolute inset-1 border border-[#b76e79]/10 pointer-events-none rounded-[3px]" />

              {/* Console Header Bar */}
              <div className="relative border-b border-[#b76e79]/40 bg-[#1c070c]/90 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-gold drop-shadow-[0_0_8px_rgba(220,197,123,0.5)] animate-pulse" />
                  <div className="flex flex-col text-left">
                    <h2 className="font-serif text-lg text-ivory tracking-wider italic font-light flex items-center gap-2">
                      Sovereign Vault OS <span className="font-mono text-[9px] bg-oxblood/80 border border-[#b76e79]/30 px-1.5 py-0.5 text-ivory/90 uppercase tracking-widest rounded-sm not-italic">v1.82</span>
                    </h2>
                    <span className="font-mono text-[8px] text-[#b76e79] uppercase tracking-[0.3em]">
                      Security Level Clearance: {isUnlocked ? "OMEGA_AUTHORIZED" : "STANDBY_OVERRIDE"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* CRT status */}
                  <button 
                    onClick={toggleCrtFilter}
                    className={`font-mono text-[8px] tracking-widest uppercase border px-2 py-1 rounded-sm  transition-all ${
                      crtEnabled ? "bg-[#b76e79]/20 text-[#f7d6c8] border-[#b76e79]/60" : "bg-transparent text-ivory/40 border-ivory/15"
                    }`}
                  >
                    CRT_SCANLINES: {crtEnabled ? "ON" : "OFF"}
                  </button>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      stopSynth();
                    }}
                    className="font-mono text-[10px] text-[#b76e79] uppercase tracking-[0.2em] border border-[#b76e79]/30 hover:border-gold hover:text-gold px-3 py-1 bg-black/40 transition-colors "
                  >
                    [ Close Terminal ]
                  </button>
                </div>
              </div>

              {/* Main Workspace Frame */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[500px]">
                
                {/* Asymmetrical Left Tab Sidebar */}
                <div className="w-full md:w-56 border-r border-[#b76e79]/30 bg-black/60 flex flex-col justify-between py-4">
                  <div className="flex flex-col gap-1.5 px-3">
                    <span className="font-mono text-[8px] text-ivory/30 uppercase tracking-[0.2em] pl-3 mb-2">OPERATING SYSTEM DIRECTORY</span>
                    
                    <button
                      onClick={() => setActiveTab("security")}
                      className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-[10.5px] uppercase tracking-wider text-left border rounded-sm transition-all  ${
                        activeTab === "security"
                          ? "bg-gradient-to-r from-[#29070f] to-transparent text-[#f7d6c8] border-[#b76e79]/60 pl-6"
                          : "bg-transparent text-ivory/60 border-transparent hover:text-ivory hover:bg-ivory/5"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-oxblood" />
                      Security Clearance
                    </button>

                    <button
                      onClick={() => setActiveTab("resonance")}
                      className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-[10.5px] uppercase tracking-wider text-left border rounded-sm transition-all  ${
                        activeTab === "resonance"
                          ? "bg-gradient-to-r from-[#29070f] to-transparent text-[#f7d6c8] border-[#b76e79]/60 pl-6"
                          : "bg-transparent text-ivory/60 border-transparent hover:text-ivory hover:bg-ivory/5"
                      }`}
                    >
                      <Volume2 className="w-4 h-4 text-gold" />
                      Sovereign Resonance
                    </button>

                    <button
                      onClick={() => setActiveTab("ledger")}
                      className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-[10.5px] uppercase tracking-wider text-left border rounded-sm transition-all  ${
                        activeTab === "ledger"
                          ? "bg-gradient-to-r from-[#29070f] to-transparent text-[#f7d6c8] border-[#b76e79]/60 pl-6"
                          : "bg-transparent text-ivory/60 border-transparent hover:text-ivory hover:bg-ivory/5"
                      }`}
                    >
                      <List className="w-4 h-4 text-[#b76e79]" />
                      Sovereign Ledger
                    </button>

                    <button
                      onClick={() => setActiveTab("diagnostics")}
                      className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-[10.5px] uppercase tracking-wider text-left border rounded-sm transition-all  ${
                        activeTab === "diagnostics"
                          ? "bg-gradient-to-r from-[#29070f] to-transparent text-[#f7d6c8] border-[#b76e79]/60 pl-6"
                          : "bg-transparent text-ivory/60 border-transparent hover:text-ivory hover:bg-ivory/5"
                      }`}
                    >
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      Command Console
                    </button>
                  </div>

                  {/* System Core Telemetry Widget */}
                  <div className="px-5 py-4 border-t border-ivory/5 mx-3 font-mono text-[8.5px] text-ivory/40 flex flex-col gap-2 bg-[#0c0203]/40 rounded-sm">
                    <div className="flex justify-between items-center">
                      <span>STABILIZED:</span>
                      <span className="text-emerald-500 font-semibold animate-pulse">OK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DURABLE ENGINES:</span>
                      <span className="text-gold">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SOVEREIGN CLOCK:</span>
                      <span className="text-oxblood">SYS_v1.82</span>
                    </div>
                  </div>
                </div>

                {/* Main Workspace Stage */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-hide relative min-h-[420px] bg-black/30">
                  <div className="absolute inset-0 bg-[#0e0204]/10 pointer-events-none" />
                  
                  {/* TAB CONTENT: SECURITY CLEARANCE */}
                  {activeTab === "security" && (
                    <div className="flex flex-col gap-6 text-left select-text">
                      <div className="border-b border-ivory/10 pb-4 flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[8.5px] text-oxblood font-semibold tracking-[0.3em] uppercase">{"// SECURITY DECRYPTION UNIT"}</span>
                          <h3 className="font-serif text-3xl text-ivory font-light italic">Clearance Terminal</h3>
                        </div>
                        <ShieldAlert className={`w-8 h-8 ${isUnlocked ? "text-emerald-500" : "text-oxblood animate-pulse"}`} />
                      </div>

                      {!isUnlocked ? (
                        <div className="flex flex-col gap-6 max-w-xl">
                          <p className="font-sans text-sm text-ivory/60 font-light leading-relaxed">
                            This digital archive is highly classified. To lift the encryption, authorize using your security coordinator override passcode. Input the code into the central mainframe receiver below.
                          </p>

                          <div className="border-l-2 border-[#b76e79] pl-4 py-1.5 my-1 bg-[#1c070c]/30 font-mono text-[10px] text-gold/80 leading-relaxed uppercase">
                            {"// LOG HINT: Entry key remains logged in 'AvariceArtifacts' or 'TheVerse'. Try typing 'sovereign' or 'kingshadp'."}
                          </div>

                          <form onSubmit={handleSecurityUnlock} className="flex flex-col gap-3 mt-2">
                            <label className="font-mono text-[8.5px] text-[#b76e79] tracking-widest uppercase">INPUT ENCRYPTION CODE:</label>
                            <div className="flex gap-3">
                              <input
                                type="password"
                                required
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="flex-1 bg-black/90 border border-[#b76e79]/50 font-mono text-xs text-ivory tracking-[0.3em] px-4 py-3 outline-none focus:border-[#b76e79] transition-all rounded-sm shadow-[inset_0_0_10px_rgba(147,0,10,0.2)]"
                                placeholder="••••••••••••••"
                              />
                              <button
                                type="submit"
                                className="bg-[#b76e79]/30 hover:bg-[#b76e79]/70 border border-[#b76e79]/50 text-ivory font-mono text-[10px] tracking-widest uppercase px-6  transition-all flex items-center gap-2"
                              >
                                OVERRIDE <KeyRound className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {overrideError && (
                              <p className="font-mono text-[9px] text-oxblood uppercase tracking-wider font-semibold animate-shake mt-1">
                                ⚠ OVERRIDE REFUSED. SECURE LAYER COMPROMISED. RETRY.
                              </p>
                            )}
                          </form>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-6">
                          <div className="bg-[#101b13]/40 border border-emerald-900/40 p-6 rounded-sm flex items-start gap-4">
                            <ShieldCheck className="w-10 h-10 text-emerald-500 shrink-0" />
                            <div className="flex flex-col gap-1">
                              <h4 className="font-serif text-lg text-[#ecfdf5] font-light">CLEARANCE PROTOCOLS DECRYPTED</h4>
                              <p className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest leading-relaxed">
                                AUTHORIZED CODE: OMEGA-ADMIN // DECRYPTION INTEGRITY STABLE AT 100%
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
                            {/* Vault Secret Documents Card 1 */}
                            <div className="border border-[#b76e79]/40 bg-black/40 p-5 rounded-sm relative overflow-hidden flex flex-col gap-3 shadow-[0_10px_25px_rgba(59,6,11,0.5)]">
                              <span className="font-mono text-[8px] text-gold uppercase tracking-widest">[ CORES-42 BLUEPRINT ]</span>
                              <h4 className="font-serif text-xl text-ivory font-light italic">The Sovereign Equation</h4>
                              <p className="font-sans text-xs text-ivory/50 font-light leading-relaxed">
                                &apos;The distance between creators and listeners collapses completely inside the sovereign code. The noise has no rank, but the core has gravity.&apos;
                              </p>
                              <div className="font-mono text-[8.5px] text-[#b76e79] border-t border-ivory/5 pt-3 mt-1 uppercase flex justify-between">
                                <span>COORDINATES:</span>
                                <span>LAT_SECT_42.18°N</span>
                              </div>
                            </div>

                            {/* Vault Secret Documents Card 2 */}
                            <div className="border border-[#b76e79]/40 bg-black/40 p-5 rounded-sm relative overflow-hidden flex flex-col gap-3 shadow-[0_10px_25px_rgba(59,6,11,0.5)]">
                              <span className="font-mono text-[8px] text-gold uppercase tracking-widest">[ DECRYPTION CODES ]</span>
                              <h4 className="font-serif text-xl text-ivory font-light italic">The Oracle Codex</h4>
                              <p className="font-sans text-xs text-ivory/50 font-light leading-relaxed">
                                Secure direct telemetry access points mapped to structural database nodes inside the virtual staged 3D portal. Frequencies established.
                              </p>
                              <div className="font-mono text-[8.5px] text-[#b76e79] border-t border-ivory/5 pt-3 mt-1 uppercase flex justify-between">
                                <span>ORBIT STATE:</span>
                                <span>STABLE_0.1824λ</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                setIsUnlocked(false);
                                appendTerminal("REVOKED SECURITY PRIVILEGES. VAULT RE-LOCKED.");
                              }}
                              className="font-mono text-[9px] text-oxblood border border-oxblood/30 hover:border-oxblood bg-black/50 hover:bg-oxblood/10 px-4 py-2  transition-colors"
                            >
                              [ RE-LOCK ENCRYPTION ]
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB CONTENT: SOVEREIGN RESONANCE */}
                  {activeTab === "resonance" && (
                    <div className="flex flex-col gap-6 text-left select-text">
                      <div className="border-b border-ivory/10 pb-4 flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[8.5px] text-gold font-semibold tracking-[0.3em] uppercase">{"// ANALOG WAVE SYNTHESIZER GENERATOR"}</span>
                          <h3 className="font-serif text-3xl text-ivory font-light italic">Sovereign Resonance</h3>
                        </div>
                        <Activity className={`w-8 h-8 ${isSynthActive ? "text-gold animate-pulse" : "text-ivory/20"}`} />
                      </div>

                      <p className="font-sans text-sm text-ivory/60 font-light leading-relaxed">
                        Modulate the ambient frequency of the virtual kingdom. The Web Audio generator initializes an analog synthesizer drone. Modulate frequencies, wave structures, and LFO modulations to adjust the vault&apos;s physical resonance.
                      </p>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* Synth Visualizer and Primary Toggle */}
                        <div className="lg:col-span-5 border border-[#b76e79]/40 bg-black/50 p-6 rounded-sm flex flex-col justify-between gap-6 shadow-[0_15px_30px_rgba(59,6,11,0.6)]">
                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">LIVE Waveform Spectrum</span>
                            <canvas
                              ref={canvasRef}
                              width={320}
                              height={120}
                              className="w-full h-28 border border-ivory/10 rounded-sm bg-black"
                            />
                          </div>

                          <button
                            onClick={toggleSynth}
                            className={`w-full py-4 font-mono text-[10px] tracking-[0.3em] uppercase font-bold border rounded-sm transition-all flex items-center justify-center gap-3  ${
                              isSynthActive
                                ? "bg-oxblood/80 border-[#b76e79] text-ivory hover:bg-oxblood/90 shadow-[0_0_15px_rgba(147,0,10,0.5)]"
                                : "bg-gradient-to-r from-[#1c070c] to-[#0d0102] border-[#b76e79]/50 text-gold hover:border-gold"
                            }`}
                          >
                            {isSynthActive ? (
                              <>
                                <Pause className="w-4 h-4 fill-current" /> SUSPEND RESONANCE
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 fill-current" /> INITIALIZE RESONANCE
                              </>
                            )}
                          </button>
                        </div>

                        {/* Modulators Controls */}
                        <div className="lg:col-span-7 border border-[#b76e79]/30 bg-black/30 p-6 rounded-sm flex flex-col gap-5">
                          <span className="font-mono text-[9px] text-[#b76e79] uppercase tracking-widest font-semibold border-b border-ivory/5 pb-2">FREQUENCY SWEEP & SYSTEM MODS</span>
                          
                          {/* Frequency Controller */}
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between font-mono text-[9.5px]">
                              <span className="text-ivory/40">BASE RES_FREQ:</span>
                              <span className="text-gold font-bold">{synthFreq.toFixed(1)} Hz</span>
                            </div>
                            <input
                              type="range"
                              min="40"
                              max="528"
                              step="0.5"
                              value={synthFreq}
                              onChange={(e) => setSynthFreq(parseFloat(e.target.value))}
                              className="w-full accent-gold bg-black/60 h-1.5 rounded-sm outline-none "
                            />
                            <div className="flex justify-between font-mono text-[8px] text-ivory/30">
                              <span>40Hz [SUB-BASS]</span>
                              <span>110Hz [A2 BASE]</span>
                              <span>432Hz [COSMIC]</span>
                              <span>528Hz [HEART]</span>
                            </div>
                          </div>

                          {/* Wave Structure */}
                          <div className="flex flex-col gap-2 mt-1">
                            <span className="font-mono text-[9.5px] text-ivory/40">WAVE SHAPE MODIFIER:</span>
                            <div className="grid grid-cols-3 gap-2">
                              {(["sine", "triangle", "sawtooth"] as const).map((wave) => (
                                <button
                                  key={wave}
                                  onClick={() => {
                                    setSynthWave(wave);
                                    appendTerminal(`SYNTH WAVEFORM MODULATED TO: ${wave.toUpperCase()}`);
                                  }}
                                  className={`font-mono text-[9px] py-2 rounded-sm border  uppercase transition-all ${
                                    synthWave === wave
                                      ? "bg-[#b76e79]/20 text-[#f7d6c8] border-[#b76e79]"
                                      : "bg-transparent text-ivory/40 border-ivory/10 hover:border-ivory/35"
                                  }`}
                                >
                                  {wave === "sine" && "SINE [DEEP]"}
                                  {wave === "triangle" && "TRI [TACTILE]"}
                                  {wave === "sawtooth" && "SAW [METAL]"}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {/* Volume */}
                            <div className="flex flex-col gap-1.5 text-left">
                              <span className="font-mono text-[8.5px] text-ivory/40 uppercase">RESONANCE_GAIN: {(synthVolume * 100).toFixed(0)}%</span>
                              <input
                                type="range"
                                min="0"
                                max="0.6"
                                step="0.01"
                                value={synthVolume}
                                onChange={(e) => setSynthVolume(parseFloat(e.target.value))}
                                className="accent-[#b76e79] bg-black/60 h-1 rounded-sm "
                              />
                            </div>

                            {/* LFO Speed (Resonance Mod) */}
                            <div className="flex flex-col gap-1.5 text-left">
                              <span className="font-mono text-[8.5px] text-ivory/40 uppercase">DETUNING SWAY_SPEED: {resonanceMod}Hz</span>
                              <input
                                type="range"
                                min="2"
                                max="24"
                                step="1"
                                value={resonanceMod}
                                onChange={(e) => setResonanceMod(parseInt(e.target.value))}
                                className="accent-gold bg-black/60 h-1 rounded-sm "
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: SECURE ARCHIVE LEDGER */}
                  {activeTab === "ledger" && (
                    <div className="flex flex-col gap-6 text-left select-text">
                      <div className="border-b border-ivory/10 pb-4 flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[8.5px] text-oxblood font-semibold tracking-[0.3em] uppercase">{"// DURABLE SYSTEMS SLATE METRIC"}</span>
                          <h3 className="font-serif text-3xl text-ivory font-light italic">Sovereign Ledger</h3>
                        </div>
                        <Save className="w-8 h-8 text-[#b76e79]" />
                      </div>

                      <p className="font-sans text-sm text-ivory/60 font-light leading-relaxed">
                        Inscribe coordinates, notes, and secure data logs onto the durable local slate. All archives are saved locally on your physical terminal storage core, preventing remote vector intercept.
                      </p>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Write Form */}
                        <div className="lg:col-span-5 border border-[#b76e79]/40 bg-[#1c070c]/20 p-6 rounded-sm shadow-[0_15px_30px_rgba(59,6,11,0.5)]">
                          <form onSubmit={handleCreateLog} className="flex flex-col gap-4">
                            <span className="font-mono text-[8.5px] text-gold uppercase tracking-[0.2em] border-b border-[#b76e79]/20 pb-2">DRAFT NEW ENTRY</span>
                            
                            <div className="flex flex-col gap-1">
                              <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">ENTRY TITLE:</label>
                              <input
                                type="text"
                                required
                                value={newLog.title}
                                onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                                className="bg-black/90 border border-ivory/10 font-sans text-xs text-ivory px-3 py-2 outline-none focus:border-[#b76e79]/60 transition-all rounded-sm "
                                placeholder="Planetary core log"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">COORDINATE SECTOR:</label>
                              <select
                                value={newLog.sector}
                                onChange={(e) => setNewLog({ ...newLog, sector: e.target.value })}
                                className="bg-black/90 border border-ivory/10 font-mono text-[9px] text-gold tracking-widest px-3 py-2 outline-none focus:border-[#b76e79]/60 transition-all rounded-sm "
                              >
                                <option value="ORBIT-42">ORBIT-42 // APEX</option>
                                <option value="CORE-ALPHA">CORE-ALPHA // HALL</option>
                                <option value="ORACLE-A">ORACLE-A // CAVERN</option>
                                <option value="VECTOR-B">VECTOR-B // PERIMETER</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="font-mono text-[8px] text-ivory/40 uppercase tracking-widest">BLUEPRINT SPEC DETAILS:</label>
                              <textarea
                                required
                                rows={3}
                                value={newLog.details}
                                onChange={(e) => setNewLog({ ...newLog, details: e.target.value })}
                                className="bg-black/90 border border-ivory/10 font-sans text-xs text-ivory/80 px-3 py-2 outline-none focus:border-[#b76e79]/60 transition-all rounded-sm "
                                placeholder="State physical telemetry or metadata factors..."
                              />
                            </div>

                            <button
                              type="submit"
                              className="bg-[#b76e79]/30 hover:bg-[#b76e79]/70 border border-[#b76e79]/60 text-ivory font-mono text-[9px] tracking-widest uppercase py-2.5 rounded-sm transition-all "
                            >
                              INSCRIBE INTO SLATE
                            </button>
                          </form>
                        </div>

                        {/* Stored Logs Grid */}
                        <div className="lg:col-span-7 flex flex-col gap-4">
                          <span className="font-mono text-[8.5px] text-ivory/40 uppercase tracking-widest border-b border-ivory/5 pb-2">PERSISTED ARCHIVES DIRECTORY</span>
                          
                          {userLogs.length === 0 ? (
                            <div className="py-12 border border-dashed border-ivory/10 text-center font-mono text-xs text-ivory/30">
                              NO SECURE LOGS FOUND ON DIRECTORY CORE.
                            </div>
                          ) : (
                            <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto scrollbar-hide pr-1">
                              {userLogs.map((log) => (
                                <div key={log.id} className="border border-[#b76e79]/30 bg-black/30 p-4 rounded-sm flex flex-col gap-2 select-text hover:border-[#b76e79]/60 transition-all">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex flex-col text-left">
                                      <span className="font-mono text-[8px] text-gold uppercase tracking-widest">{log.sector} {"//"} {log.timestamp}</span>
                                      <h4 className="font-serif text-lg text-ivory font-light italic mt-0.5">{log.title}</h4>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteLog(log.id, log.title)}
                                      className="text-ivory/30 hover:text-oxblood transition-colors  p-1 shrink-0"
                                      aria-label="Erase entry"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <p className="font-sans text-xs text-ivory/60 font-light leading-relaxed text-left border-l border-ivory/10 pl-3">
                                    {log.details}
                                  </p>
                                  <div className="flex justify-between items-center border-t border-ivory/5 pt-2 mt-1 font-mono text-[7.5px] text-ivory/30 uppercase">
                                    <span>MD5_CHECKSUM: <span className="text-[#b76e79]">{log.checksum}</span></span>
                                    <span>STATE: SECURE</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  )}

                  {/* TAB CONTENT: COMMAND CONSOLE & ADVANCED PARAMETERS */}
                  {activeTab === "diagnostics" && (
                    <div className="flex flex-col gap-6 text-left select-text h-full min-h-[400px]">
                      <div className="border-b border-ivory/10 pb-4 flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[8.5px] text-[#b76e79] font-semibold tracking-[0.3em] uppercase">{"// SECURITY INTELLIGENCE BYPASS"}</span>
                          <h3 className="font-serif text-3xl text-ivory font-light italic">Command Terminal</h3>
                        </div>
                        <Terminal className="w-8 h-8 text-emerald-500" />
                      </div>

                      {/* Interactive Visual Tweaks Slider Section */}
                      <div className="border border-[#b76e79]/40 bg-black/40 p-4 rounded-sm grid grid-cols-1 md:grid-cols-2 gap-6 select-none shadow-[0_10px_20px_rgba(59,6,11,0.4)]">
                        <div className="flex flex-col gap-4 text-left">
                          <span className="font-mono text-[9px] text-[#b76e79] uppercase tracking-widest font-semibold border-b border-ivory/5 pb-2">ATMOSPHERIC PERSPECTIVE DRIFT</span>
                          
                          {/* Ambient Fog factor */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between font-mono text-[9px]">
                              <span className="text-ivory/40">FOG MASS FACTOR:</span>
                              <span className="text-gold font-semibold">{fogFactor.toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="4"
                              step="0.05"
                              value={fogFactor}
                              onChange={(e) => setFogFactor(parseFloat(e.target.value))}
                              className="accent-gold bg-black/60 h-1 rounded-sm "
                            />
                          </div>

                          {/* 3D Perspective parallax strength */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between font-mono text-[9px]">
                              <span className="text-ivory/40">STAGED 3D DEPTH STRENGTH:</span>
                              <span className="text-[#b76e79] font-semibold">{perspectiveStrength.toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="3"
                              step="0.05"
                              value={perspectiveStrength}
                              onChange={(e) => setPerspectiveStrength(parseFloat(e.target.value))}
                              className="accent-[#b76e79] bg-black/60 h-1 rounded-sm "
                            />
                          </div>
                        </div>

                        {/* High-end command stats */}
                        <div className="flex flex-col gap-2 font-mono text-[9px] text-ivory/40 bg-[#0e0204]/40 p-3.5 rounded-sm border border-ivory/5 justify-center">
                          <div className="flex justify-between border-b border-ivory/5 pb-1.5">
                            <span>COGNITIVE PLATFORM STATE:</span>
                            <span className="text-gold">OMEGA_v1.82</span>
                          </div>
                          <div className="flex justify-between border-b border-ivory/5 pb-1.5">
                            <span>VIRTUAL PORT ADDRESS:</span>
                            <span>PORT_3000 // STABLE</span>
                          </div>
                          <div className="flex justify-between">
                            <span>HARDWARE SHIELD ACCEL:</span>
                            <span className="text-emerald-500 font-semibold animate-pulse">ACTIVE</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Command Log Viewport */}
                      <div className="flex-1 flex flex-col border border-[#b76e79]/30 bg-black/90 p-4 rounded-sm shadow-inner min-h-[220px]">
                        <span className="font-mono text-[8px] text-emerald-500 uppercase tracking-widest mb-2">[ DIRECT DIRECTORY CORE TRANSCRIPT ]</span>
                        
                        <div className="flex-1 overflow-y-auto scrollbar-hide max-h-[160px] flex flex-col gap-1 font-mono text-[9.5px] text-emerald-400 text-left">
                          {terminalHistory.map((line, idx) => (
                            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                              {line}
                            </div>
                          ))}
                          <div ref={terminalBottomRef} />
                        </div>

                        {/* Input line */}
                        <form onSubmit={handleTerminalSubmit} className="flex gap-2 border-t border-ivory/10 pt-3 mt-2 items-center">
                          <span className="font-mono text-xs text-emerald-500 font-bold shrink-0">&gt;</span>
                          <input
                            type="text"
                            value={terminalInput}
                            onChange={(e) => setTerminalInput(e.target.value)}
                            className="flex-1 bg-transparent font-mono text-xs text-emerald-400 outline-none "
                            placeholder="Type command here... ('help' for index)"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="text-emerald-500 hover:text-emerald-300 font-mono text-[10px] uppercase tracking-widest shrink-0 "
                          >
                            [ RUN ]
                          </button>
                        </form>
                      </div>

                    </div>
                  )}

                </div>
              </div>

              {/* Console Footer Bar */}
              <div className="border-t border-[#b76e79]/40 bg-[#1c070c]/90 px-6 py-3.5 flex items-center justify-between font-mono text-[8px] text-[#b76e79]/60 select-none z-10">
                <span className="flex items-center gap-2">
                  <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} /> COGNITIVE SHIELD ACCELEROMETER CODES ACTIVE
                </span>
                <span>SEC_PORT_3000 // ORBIT_42 // KINGSHADP ARCHIVE</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
