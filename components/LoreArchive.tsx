"use client";

import { useState, useRef, useEffect, memo, useCallback } from "react";
import { useEngine } from "./EngineProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Flame, Volume2, VolumeX } from "lucide-react";
import { ArtifactCard, Modal } from "./ArtifactCard";
import { Radar } from "./Radar";
import { AudioVisualizer } from "./AudioVisualizer";

const ARCHIVES = [
  { id: "A-001", classification: "Manifesto", title: "The Sovereign Thread", content: "Architecture built strictly to outlast trends. We define the void rather than allowing it to define us. The principles laid forth are unbreakable. True premium aesthetics are forged through intense pressure, demanding flawless execution across every single touchpoint.", image: "/ChatGPT Image May 28, 2026, 02_10_07 AM (5).png" },
  { id: "A-002", classification: "Visual Code", title: "Oxblood & Platinum", content: "Crimson filters unoriginality. Platinum asserts permanence. Our color palette represents the treasury of the unseen. We strip away the unnecessary defaults, relying on high-contrast pairings to deliver aggressive elegance onto the digital canvas.", image: "/ChatGPT Image May 28, 2026, 02_10_07 AM (6)-1.png" },
  { id: "A-003", classification: "Aural Grid", title: "Sonic Architecture", content: "Silence is a luxury. We punctuate the absolute zero ambient space only with heavily calculated low-frequency waveforms to establish pressure. The integration of audio is not a garnish, but a core column of the KingShadP structural manifesto.", image: "/ChatGPT Image May 28, 2026, 02_10_36 AM (1)-1.png" },
  { id: "A-004", classification: "Identity", title: "KingShadP Prime", content: "Not just a title, but a structural protocol. The creator orchestrates the reality engine from behind the veil. We do not apologize. We do not explain. The final build stands as undeniable proof of absolute dominance within the digital framework.", image: "/ChatGPT Image May 28, 2026, 02_11_23 AM (1).png" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    filter: "blur(5px)", 
    transition: { duration: 0.3 } 
  }
};

export const LoreArchive = memo(function LoreArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [archives, setArchives] = useState(ARCHIVES);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  
  // Direct parameter deep link active state
  const [activeDeepLinkItem, setActiveDeepLinkItem] = useState<any>(null);

  // Sync state on load and register listener hooks to prevent SSR hydration gaps
  useEffect(() => {
    // 1. Load search query
    const savedQuery = localStorage.getItem("kingshadp_archive_search");
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }

    // 2. Blend files from core and custom user logs
    const syncDatabaseLocal = () => {
      const savedUserEntries = localStorage.getItem("kingshadp_user_archives");
      if (savedUserEntries) {
        try {
          const parsed = JSON.parse(savedUserEntries);
          setArchives([...ARCHIVES, ...parsed]);
        } catch (e) {
          setArchives(ARCHIVES);
        }
      } else {
        setArchives(ARCHIVES);
      }
    };

    syncDatabaseLocal();

    // 3. Register system-wide storage trigger events
    window.addEventListener("kingshadp_vault_sync", syncDatabaseLocal);
    return () => {
      window.removeEventListener("kingshadp_vault_sync", syncDatabaseLocal);
    };
  }, []);

  // Check URL parameters for direct vault entry focus linking
  useEffect(() => {
    if (archives.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const vaultId = params.get("vault");
      if (vaultId) {
        const matched = archives.find(x => x.id === vaultId);
        if (matched) {
          setActiveDeepLinkItem(matched);
        }
      }
    }
  }, [archives]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    localStorage.setItem("kingshadp_archive_search", val);
  };
  
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEngine(useCallback((state) => {
    if (sectionRef.current && gridContainerRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      
      const rawProgress = (vh - rect.top) / (vh * 0.7);
      const progress = Math.max(0, Math.min(1, rawProgress));

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const rotateX = 25 * (1 - Math.min(1, easeOutQuart));
      const scale = 0.85 + (0.15 * Math.min(1, easeOutQuart));
      const yStr = `${100 * (1 - easeOutQuart)}px`;
      const blur = 10 * (1 - easeOutQuart);
      const opacity = easeOutQuart;

      gridContainerRef.current.style.transform = `perspective(1500px) rotateX(${rotateX}deg) scale(${scale}) translateY(${yStr})`;
      gridContainerRef.current.style.filter = `blur(${blur}px)`;
      gridContainerRef.current.style.opacity = Math.max(0.01, opacity).toString();
    }
  }, []));

  const toggleSound = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNode.current = audioCtx.current.createGain();
      gainNode.current.connect(audioCtx.current.destination);
      gainNode.current.gain.value = 0;

      oscillator.current = audioCtx.current.createOscillator();
      oscillator.current.type = "sine";
      oscillator.current.frequency.value = 40; 

      const lfo = audioCtx.current.createOscillator();
      lfo.type = "triangle";
      lfo.frequency.value = 0.15;
      const lfoGain = audioCtx.current.createGain();
      lfoGain.gain.value = 6;
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.current.frequency);
      lfo.start();

      const analyser = audioCtx.current.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      
      oscillator.current.connect(analyser);
      analyser.connect(gainNode.current);
      
      oscillator.current.start();
      setAnalyserNode(analyser);
    }

    if (audioEnabled) {
      gainNode.current!.gain.setTargetAtTime(0, audioCtx.current.currentTime, 0.5);
      setAudioEnabled(false);
    } else {
      audioCtx.current.resume();
      gainNode.current!.gain.setTargetAtTime(0.2, audioCtx.current.currentTime, 1);
      setAudioEnabled(true);
    }
  };

  const triggerChaos = () => {
    setArchives([...archives].sort(() => Math.random() - 0.5));
  };

  const filteredArchives = archives.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.classification.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );
  });

  return (
    <section ref={sectionRef} id="vault" className="relative w-full py-32 px-6 lg:px-24 z-10 border-t border-ivory/10 bg-gradient-to-b from-void to-[#080808] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-noise opacity-30" />
      <Radar />

      {/* Floating Reliquary Audio Toggle */}
      <button
        onClick={toggleSound}
        className="absolute top-12 right-6 lg:right-24 z-50 flex items-center gap-4 bg-void/80 backdrop-blur-md px-5 py-3 border border-oxblood/30 hover:border-oxblood hover:shadow-[0_0_20px_rgba(147,0,10,0.5)] transition-all group pointer-events-auto rounded-sm overflow-hidden"
      >
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          {audioEnabled ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-oxblood shadow-[0_0_12px_#93000a]"></span>
              </span>
              <Volume2 className="w-5 h-5 text-ivory/90 group-hover:text-gold transition-colors" />
            </>
          ) : (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-ivory/20" />
              <VolumeX className="w-5 h-5 text-ivory/40 group-hover:text-ivory/70 transition-colors" />
            </>
          )}
        </div>
        <div className="hidden sm:flex flex-col items-start gap-1 relative z-10">
          <span className="font-mono text-[8px] text-ivory/50 tracking-[0.4em] uppercase">Reliquary_Acoustics</span>
          <span className={`font-mono text-[10px] tracking-[0.2em] uppercase font-bold ${audioEnabled ? 'text-gold drop-shadow-[0_0_5px_rgba(220,197,123,0.8)]' : 'text-ivory/30'}`}>
            {audioEnabled ? "Resonating" : "Silenced"}
          </span>
        </div>
        {audioEnabled && analyserNode && (
          <div className="ml-2 hidden sm:block">
            <AudioVisualizer analyser={analyserNode} />
          </div>
        )}
      </button>

      <div className="max-w-7xl mx-auto w-full relative z-10 mt-16">
        {/* Header Grid */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 border-b border-ivory/20 pb-8 gap-8">
          <div>
            <h2 className="font-serif text-5xl lg:text-7xl text-ivory font-light drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              The Reliquary <span className="text-oxblood italic drop-shadow-[0_0_10px_rgba(147,0,10,0.8)]">.</span>
            </h2>
            <p className="mt-4 text-xs md:text-sm text-ivory/50 font-mono tracking-[0.3em] uppercase">
              Secure Indexing // Sovereign Database
            </p>
          </div>
          
          {/* High-Contrast Search & Actions Interface */}
          <div className="relative w-full xl:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/30" />
              <input
                type="text"
                placeholder="Search Identity, Architecture..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-void border border-ivory/20 px-12 py-4 font-mono text-sm text-ivory tracking-widest focus:outline-none focus:border-gold focus:shadow-[0_0_15px_rgba(220,197,123,0.3)] transition-all placeholder:text-ivory/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
              />
              {searchQuery && (
                <button 
                  onClick={() => handleSearchChange("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            <button 
              onClick={triggerChaos}
              className="px-8 py-4 border border-oxblood/40 bg-void hover:bg-oxblood/10 hover:border-oxblood hover:shadow-[0_0_20px_rgba(147,0,10,0.4)] font-mono text-xs uppercase tracking-widest text-ivory transition-all flex items-center justify-center gap-3 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMjIyMiIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwMCIvPjwvc3ZnPg==')] opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />
              <Flame className="w-4 h-4 text-oxblood group-hover:scale-125 transition-transform duration-500" />
              <span className="relative z-10">Chaos Mode</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display Indicators */}
        <div className="mb-10 flex justify-between items-center px-1">
          <span className="font-mono text-[10px] text-ivory/40 uppercase tracking-[0.3em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-ivory/40 rounded-full animate-ping" />
            Vault Query: Found {filteredArchives.length} matches
          </span>
        </div>
        
        {/* Animated Staggered Layout Grid */}
        <div ref={gridContainerRef} className="will-change-transform origin-top z-20 relative transition-none">
          <motion.div 
            layout
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full"
          >
            <AnimatePresence mode="popLayout">
              {filteredArchives.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={itemVariants}
                  exit="exit"
                  className="w-full relative z-20 will-change-transform"
                >
                  <ArtifactCard data={item} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Deep Link Modal Trigger */}
      <AnimatePresence>
        {activeDeepLinkItem && (
          <Modal 
            data={activeDeepLinkItem} 
            onClose={() => {
              // Clear URL parameter when manual close happens to keep address clean
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.delete("vault");
                window.history.replaceState({}, "", url.toString());
              }
              setActiveDeepLinkItem(null);
            }} 
            baseColorRGB={
              activeDeepLinkItem.classification === "Manifesto" ? "59, 130, 246" :
              activeDeepLinkItem.classification === "Visual Code" ? "139, 92, 246" :
              activeDeepLinkItem.classification === "Aural Grid" ? "16, 185, 129" :
              "220, 197, 123"
            } 
          />
        )}
      </AnimatePresence>
    </section>
  );
});
