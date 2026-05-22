"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Orbit, 
  Map, 
  Clock, 
  Flame, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  Locate,
  ArrowUpRight,
  Compass
} from "lucide-react";

interface NavigationResult {
  constellation: string;
  latitude: number;
  ascension: number;
  idealLat: number;
  idealAsc: number;
  distortion: number;
  travelCycles: number;
  encounterChance: number;
  encounterType: string;
  statusText: string;
  isPerfect: boolean;
  resourceDetails: string;
  prophecy: string;
}

const CONSTELLATIONS_INFO = [
  {
    name: "The Scepter of Avarice",
    sector: "Gold Core Node",
    ideal: "LAT 45° // ASC 12.0h",
    desc: "The primary coordinate of absolute authority. Aligned with gold fire cascades.",
  },
  {
    name: "Oxblood Eclipse",
    sector: "Crimson Abyss",
    ideal: "LAT -90° // ASC 3.3h",
    desc: "A menacing star cluster shrouded in deep burgundy velvet and abyssal friction.",
  },
  {
    name: "Platinum Spire",
    sector: "Prism Vector",
    ideal: "LAT 0° // ASC 0.0h",
    desc: "Pristine alignment vector. Emits an uncorrupted platinum stellar current.",
  },
  {
    name: "The Silent Lion",
    sector: "Velvet Vault Sector",
    ideal: "LAT 110° // ASC 18.5h",
    desc: "An ancient structural anchor. Quiet, secure, guarding deep dimensional secrets.",
  },
  {
    name: "Obsidian Helix",
    sector: "Black Spiral Matrix",
    ideal: "LAT -33° // ASC 8.8h",
    desc: "A massive gravity well inside the black marble layout of the multiverse.",
  },
];

export function CelestialNavigation() {
  const [selectedConst, setSelectedConst] = useState("The Scepter of Avarice");
  const [hoveredConst, setHoveredConst] = useState<string | null>(null);
  const [latitude, setLatitude] = useState(45.0);
  const [ascension, setAscension] = useState(12.0);
  const [isPlotting, setIsPlotting] = useState(false);
  const [result, setResult] = useState<NavigationResult | null>(null);
  const [hasPlotted, setHasPlotted] = useState(false);

  // Auto scroll to result or focus on result when calculated
  const handlePlot = async () => {
    setIsPlotting(true);
    try {
      const res = await fetch("/api/navigation/plot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constellation: selectedConst,
          latitude,
          ascension,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setHasPlotted(true);
      } else {
        console.error("Plotting failure:", data.error);
      }
    } catch (err) {
      console.error("Plotting failed:", err);
    } finally {
      setIsPlotting(false);
    }
  };

  // Align sliders to the ideal constellation coordinates
  const alignToIdeal = (name: string) => {
    switch (name) {
      case "The Scepter of Avarice":
        setLatitude(45.0);
        setAscension(12.0);
        break;
      case "Oxblood Eclipse":
        setLatitude(-90.0);
        setAscension(3.3);
        break;
      case "Platinum Spire":
        setLatitude(0.0);
        setAscension(0.0);
        break;
      case "The Silent Lion":
        setLatitude(110.0);
        setAscension(18.5);
        break;
      case "Obsidian Helix":
        setLatitude(-33.0);
        setAscension(8.8);
        break;
    }
    setSelectedConst(name);
  };

  // Click on Star Chart SVG to set coordinates
  const handleChartClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Map coordinate pixel values inside SVG (-150 to +150 approx) back to scales
    const maxRadius = Math.min(rect.width, rect.height) / 2;
    
    // Map radius to latitude: center is 0, outer rim is 180 and -180 (distribute)
    const distanceFactor = Math.sqrt(x*x + y*y) / maxRadius;
    const angleRad = Math.atan2(y, x);
    
    // Compute latitude based on distance from center
    const calculatedLat = Math.round((distanceFactor * 360) - 180);
    const croppedLat = Math.max(-180, Math.min(180, calculatedLat));
    
    // Map angle theta to ascension 24 hours: 0 rad is 0h, PI is 12h, etc.
    let calculatedAsc = ((angleRad + Math.PI) / (Math.PI * 2)) * 24;
    calculatedAsc = Math.round(calculatedAsc * 10) / 10;
    
    setLatitude(croppedLat);
    setAscension(calculatedAsc);
  };

  // Section Header
  return (
    <section id="navigation" className="py-32 px-6 lg:px-12 bg-void relative overflow-hidden border-t border-[#b76e79]/20">
      
      {/* Intricate Celestial Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #b76e79 0.5px, transparent 1px),
            linear-gradient(rgba(183, 110, 121, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(183, 110, 121, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 120px 120px, 120px 120px",
          backgroundPosition: "center"
        }}
      />
      
      {/* Nebulous Cosmic Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 50, -30, 0], 
          y: [0, -30, 50, 0],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#93000a]/10 rounded-full blur-[130px] pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ 
          x: [0, -60, 40, 0], 
          y: [0, 60, -40, 0],
          scale: [1, 1.3, 0.7, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#dcc57b]/5 rounded-full blur-[140px] pointer-events-none z-0" 
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#93000a]/3 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[100rem] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-6 mb-24 border-b border-[#b76e79]/10 pb-12">
          <div className="flex items-center gap-4">
            <Orbit className="w-5 h-5 text-[#b76e79] animate-spin-slow" />
            <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-[#b76e79]">Divine_Astrolabe_Initiative</span>
          </div>
          <h2 className="font-serif text-5xl md:text-7xl font-light text-ivory tracking-tight uppercase leading-[0.9]">
            Celestial <br />
            <span className="italic text-[#dcc57b]">Navigation System</span>
          </h2>
          <p className="font-sans text-sm md:text-base text-ivory/40 max-w-xl leading-relaxed">
            Align the concentric elements of the ancient divine astrolabe. Plot trajectories through star charts to tap into the God-Tier Multiverse Archive and query the Oracle&apos;s cosmological judgment.
          </p>
        </div>

        {/* 12-Column Majestic Framework */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Column A: Constellation Vault & Inputs (span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between border border-[#b76e79]/20 bg-void/50 p-8 md:p-10 relative shadow-[inset_0_0_30px_rgba(147,0,10,0.05)]">
            
            {/* Corner Bracket Elements */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#b76e79]/40" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#b76e79]/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#b76e79]/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#b76e79]/40" />

            <div className="space-y-10">
              <div>
                <span className="font-mono text-[8px] text-[#b76e79]/60 tracking-[0.5em] block mb-4 uppercase">Select_Stellar_Alignment</span>
                <h3 className="font-serif text-2xl text-ivory tracking-tight italic font-medium">Cosmic Constellations</h3>
              </div>

              {/* Constellation Nodes List */}
              <div className="space-y-3">
                {CONSTELLATIONS_INFO.map((node) => {
                  const isActive = selectedConst === node.name;
                  return (
                    <button
                      key={node.name}
                      onClick={() => alignToIdeal(node.name)}
                      className={`w-full text-left p-4 border transition-all duration-700 block relative group ${
                        isActive 
                          ? "border-[#b76e79] bg-[#93000a]/10 shadow-[0_0_20px_rgba(147,0,10,0.1)] text-ivory" 
                          : "border-ivory/5 bg-transparent hover:border-ivory/20 text-ivory/50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-serif text-lg tracking-tight font-medium group-hover:text-ivory transition-colors">
                          {node.name}
                        </span>
                        <span className="font-mono text-[8px] tracking-[0.2em] text-[#dcc57b] uppercase">
                          {node.sector}
                        </span>
                      </div>
                      <p className={`font-sans text-xs tracking-wide leading-relaxed truncate ${isActive ?'text-ivory/80':'text-ivory/30'}`}>
                        {node.desc}
                      </p>
                      
                      {/* Anchor Indicator */}
                      <span className="absolute top-1/2 right-4 -translate-y-1/2 w-1.5 h-1.5 bg-[#b76e79] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  );
                })}
              </div>

              <div className="h-px bg-[#b76e79]/15" />

              {/* Sliders Area */}
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between font-mono text-[9px] tracking-widest text-[#dcc57b] uppercase mb-3">
                    <span>Latitude of the Void</span>
                    <span>{latitude >= 0 ? `+${latitude}` : latitude}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full accent-[#b76e79] bg-ivory/5 appearance-none h-[2px] transition-all cursor-ew-resize"
                  />
                  <div className="flex justify-between font-mono text-[7px] text-ivory/20 uppercase mt-1">
                    <span>-180° (South)</span>
                    <span>0° (Core)</span>
                    <span>+180° (North)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[9px] tracking-widest text-[#dcc57b] uppercase mb-3">
                    <span>Right Ascension</span>
                    <span>{ascension.toFixed(1)}h</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="24.0"
                    step="0.1"
                    value={ascension}
                    onChange={(e) => setAscension(Number(e.target.value))}
                    className="w-full accent-[#b76e79] bg-ivory/5 appearance-none h-[2px] transition-all cursor-ew-resize"
                  />
                  <div className="flex justify-between font-mono text-[7px] text-ivory/20 uppercase mt-1">
                    <span>0.0h</span>
                    <span>12.0h (Equinox)</span>
                    <span>24.0h</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Plot Button Trigger */}
            <div className="mt-12 group/btn relative">
              {/* Intense Glitch Layer when plotting */}
              <AnimatePresence>
                {isPlotting && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute -inset-1 bg-[#dcc57b]/20 blur-md pointer-events-none z-0 animate-pulse" 
                  />
                )}
              </AnimatePresence>

              <button
                onClick={handlePlot}
                disabled={isPlotting}
                className={`w-full relative overflow-hidden border transition-all duration-700 font-mono text-[10px] tracking-[0.5em] py-5 px-6 uppercase z-10 ${
                  isPlotting 
                    ? "border-[#dcc57b] bg-[#93000a]/60 text-[#dcc57b] shadow-[0_0_50px_rgba(220,197,123,0.3)]"
                    : "border-[#b76e79] bg-[#93000a]/20 hover:bg-[#93000a]/40 text-ivory shadow-[0_0_30px_rgba(147,0,10,0.15)] hover:shadow-[0_0_50px_rgba(147,0,10,0.3)]"
                }`}
              >
                <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#b76e79]/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                {isPlotting ? (
                  <span className="flex items-center justify-center gap-3">
                    <RefreshCw className="w-3 h-3 animate-spin text-[#dcc57b]" /> ALIGNING_ORACLE_VECTORS_
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    PLOT NAVIGATION COURSE <ArrowUpRight className="w-4 h-4 text-[#dcc57b]" />
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Column B: Astrolabe Circular SVG (span 4) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center border border-[#b76e79]/20 bg-[#050505]/90 p-8 md:p-12 relative min-h-[450px] shadow-[0_0_50px_rgba(147,0,10,0.08)]">
            
            {/* Subtle vintage mechanical elements inside the background */}
            <div className="absolute inset-4 border border-[#b76e79]/5 rounded-full pointer-events-none z-0" />
            <div className="absolute inset-16 border border-[#b76e79]/10 rounded-full pointer-events-none z-0 dash-array" 
              style={{ strokeDasharray: "4 8" }}
            />
            
            {/* Decorative cardinal directions */}
            <span className="absolute top-6 font-mono text-[7px] text-[#b76e79] tracking-[0.5em] uppercase z-10">[ NORTH_SECTOR ]</span>
            <span className="absolute bottom-6 font-mono text-[7px] text-[#b76e79] tracking-[0.5em] uppercase z-10">[ SOUTH_SECTOR ]</span>
            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-[7px] text-[#b76e79] tracking-[0.5em] uppercase rotate-90 z-10">EAST</span>
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-[7px] text-[#b76e79] tracking-[0.5em] uppercase -rotate-90 z-10">WEST</span>

            {/* Interactive Astrolabe SVG Plate */}
            <div className="relative w-full max-w-[340px] aspect-square z-10 flex items-center justify-center cursor-crosshair group">
              <svg 
                viewBox="0 0 300 300"
                onClick={handleChartClick}
                className="w-full h-full text-ivory select-none"
              >
                {/* Decorative Astrolabe rim plate */}
                <circle cx="150" cy="150" r="142" fill="none" stroke="#b76e79" strokeWidth="1" strokeOpacity="0.4" />
                <circle cx="150" cy="150" r="140" fill="none" stroke="#b76e79" strokeWidth="0.5" strokeOpacity="0.2" />
                <circle cx="150" cy="150" r="134" fill="none" stroke="#b76e79" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />

                {/* Radar Plotting Scanner */}
                <AnimatePresence>
                  {isPlotting && (
                    <motion.g 
                      initial={{ opacity: 0, rotate: 0 }} 
                      animate={{ opacity: 1, rotate: 360 }} 
                      exit={{ opacity: 0 }}
                      transition={{ rotate: { duration: 1.5, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.3 } }}
                      style={{ transformOrigin: "150px 150px" }}
                    >
                      <path d="M150 150 L150 10 A140 140 0 0 1 290 150 Z" fill="url(#radarScan)" />
                      <line x1="150" y1="150" x2="150" y2="10" stroke="#dcc57b" strokeWidth="1.5" strokeOpacity="0.9" filter="drop-shadow(0 0 4px #dcc57b)" />
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Concentric rings rotating based on alignment */}
                <motion.g
                  animate={isPlotting ? { rotate: [0, 5, -5, 0], scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "150px 150px" }}
                >
                  {/* Ring A: Latitude representing grid */}
                  <g style={{ transform: `rotate(${latitude}deg)`, transformOrigin: "150px 150px", transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                  <circle cx="150" cy="150" r="110" fill="none" stroke="#b76e79" strokeWidth="0.75" strokeOpacity="0.3" />
                  <line x1="150" y1="40" x2="150" y2="260" stroke="#b76e79" strokeWidth="0.5" strokeOpacity="0.15" />
                  <text x="150" y="32" fontSize="5" fontFamily="var(--font-mono)" fill="#b76e79" fillOpacity="0.6" textAnchor="middle" letterSpacing="1">VOID LAT</text>
                </g>

                {/* Ring B: Right Ascension ring */}
                <g style={{ transform: `rotate(${ascension * 15}deg)`, transformOrigin: "150px 150px", transition: "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                  <circle cx="150" cy="150" r="80" fill="none" stroke="#dcc57b" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="20 4" />
                  <line x1="70" y1="150" x2="230" y2="150" stroke="#dcc57b" strokeWidth="0.5" strokeOpacity="0.1" />
                  <text x="215" y="148" fontSize="5" fontFamily="var(--font-mono)" fill="#dcc57b" fillOpacity="0.5" textAnchor="middle">ASC</text>
                  
                  {/* Subtle ticking metrics along the ring */}
                  <circle cx="150" cy="150" r="84" fill="none" stroke="#dcc57b" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="1 15" />
                </g>
                </motion.g>

                {/* Embedded Scattered Background Stars with Different Twinkle Speeds */}
                <g>
                  {/* Fast Twinkles */}
                  <circle cx="50" cy="60" r="1" fill="#f8f5f2" className="star-twinkle-fast" />
                  <circle cx="240" cy="80" r="0.75" fill="#dcc57b" className="star-twinkle-fast" />
                  <circle cx="110" cy="220" r="1.2" fill="#ffffff" className="star-twinkle-fast" />
                  <circle cx="80" cy="110" r="1" fill="#b76e79" className="star-twinkle-fast" />
                  
                  {/* Normal Twinkles */}
                  <circle cx="280" cy="100" r="1.5" fill="#f8f5f2" className="star-twinkle-normal" />
                  <circle cx="40" cy="190" r="1" fill="#f8f5f2" className="star-twinkle-normal" />
                  <circle cx="160" cy="30" r="0.75" fill="#dcc57b" className="star-twinkle-normal" />
                  <circle cx="220" cy="270" r="1.25" fill="#b76e79" className="star-twinkle-normal" />
                  <circle cx="70" cy="250" r="1.5" fill="#ffffff" className="star-twinkle-normal" />

                  {/* Slow Twinkles */}
                  <circle cx="200" cy="40" r="1.2" fill="#ffffff" className="star-twinkle-slow" />
                  <circle cx="120" cy="120" r="0.75" fill="#dcc57b" className="star-twinkle-slow" />
                  <circle cx="270" cy="220" r="1" fill="#f8f5f2" className="star-twinkle-slow" />
                  <circle cx="30" cy="140" r="1.5" fill="#b76e79" className="star-twinkle-slow" />
                </g>

                {/* Static Star Coordinates Map (glowing vectors of constellations) */}
                {/* Plot the constellation coordinates */}
                <g>
                  <motion.line 
                    key={`Avarice-${selectedConst}`} 
                    initial={{ pathLength: 0 }} 
                    animate={{ 
                      pathLength: 1,
                      strokeWidth: hoveredConst === "The Scepter of Avarice" ? 1.5 : 0.5,
                      stroke: hoveredConst === "The Scepter of Avarice" ? "#dcc57b" : "#b76e79",
                      strokeOpacity: hoveredConst === "The Scepter of Avarice" ? [0.4, 1, 0.4] : 0.2,
                      filter: hoveredConst === "The Scepter of Avarice" ? "drop-shadow(0px 0px 4px rgba(220,197,123,0.8))" : "none"
                    }} 
                    transition={{ 
                      duration: 1, ease: 'easeOut',
                      strokeOpacity: { repeat: hoveredConst === "The Scepter of Avarice" ? Infinity : 0, duration: 1.2 },
                      filter: { duration: 0.3 }
                    }} 
                    x1="150" y1="150" x2="195" y2="105" 
                  /> {/* Avarice (45, 12h -> +45, 180deg) */}
                  
                  <motion.line 
                    key={`Oxblood-${selectedConst}`} 
                    initial={{ pathLength: 0 }} 
                    animate={{ 
                      pathLength: 1,
                      strokeWidth: hoveredConst === "Oxblood Eclipse" ? 1.5 : 0.5,
                      stroke: hoveredConst === "Oxblood Eclipse" ? "#dcc57b" : "#b76e79",
                      strokeOpacity: hoveredConst === "Oxblood Eclipse" ? [0.4, 1, 0.4] : 0.2,
                      filter: hoveredConst === "Oxblood Eclipse" ? "drop-shadow(0px 0px 4px rgba(147,0,10,0.8))" : "none"
                    }} 
                    transition={{ 
                      duration: 1, ease: 'easeOut', delay: 0.1,
                      strokeOpacity: { repeat: hoveredConst === "Oxblood Eclipse" ? Infinity : 0, duration: 1.2 },
                      filter: { duration: 0.3 }
                    }} 
                    x1="150" y1="150" x2="150" y2="240" 
                  /> {/* Oxblood (-90, 3.3h) */}
                  
                  <motion.line 
                    key={`Spire-${selectedConst}`} 
                    initial={{ pathLength: 0 }} 
                    animate={{ 
                      pathLength: 1,
                      strokeWidth: hoveredConst === "Platinum Spire" ? 1.5 : 0.5,
                      stroke: hoveredConst === "Platinum Spire" ? "#dcc57b" : "#b76e79",
                      strokeOpacity: hoveredConst === "Platinum Spire" ? [0.4, 1, 0.4] : 0.2,
                      filter: hoveredConst === "Platinum Spire" ? "drop-shadow(0px 0px 4px rgba(255,255,255,0.8))" : "none"
                    }} 
                    transition={{ 
                      duration: 1, ease: 'easeOut', delay: 0.2,
                      strokeOpacity: { repeat: hoveredConst === "Platinum Spire" ? Infinity : 0, duration: 1.2 },
                      filter: { duration: 0.3 }
                    }} 
                    x1="150" y1="150" x2="150" y2="70" 
                  /> {/* Spire (0, 0h) */}
                  
                  <motion.line 
                    key={`Lion-${selectedConst}`} 
                    initial={{ pathLength: 0 }} 
                    animate={{ 
                      pathLength: 1,
                      strokeWidth: hoveredConst === "The Silent Lion" ? 1.5 : 0.5,
                      stroke: hoveredConst === "The Silent Lion" ? "#dcc57b" : "#b76e79",
                      strokeOpacity: hoveredConst === "The Silent Lion" ? [0.4, 1, 0.4] : 0.2,
                      filter: hoveredConst === "The Silent Lion" ? "drop-shadow(0px 0px 4px rgba(183,110,121,0.8))" : "none"
                    }} 
                    transition={{ 
                      duration: 1, ease: 'easeOut', delay: 0.3,
                      strokeOpacity: { repeat: hoveredConst === "The Silent Lion" ? Infinity : 0, duration: 1.2 },
                      filter: { duration: 0.3 }
                    }} 
                    x1="150" y1="150" x2="260" y2="185" 
                  /> {/* Lion (110, 18.5h) */}
                  
                  <motion.line 
                    key={`Helix-${selectedConst}`} 
                    initial={{ pathLength: 0 }} 
                    animate={{ 
                      pathLength: 1,
                      strokeWidth: hoveredConst === "Obsidian Helix" ? 1.5 : 0.5,
                      stroke: hoveredConst === "Obsidian Helix" ? "#dcc57b" : "#b76e79",
                      strokeOpacity: hoveredConst === "Obsidian Helix" ? [0.4, 1, 0.4] : 0.2,
                      filter: hoveredConst === "Obsidian Helix" ? "drop-shadow(0px 0px 4px rgba(209,204,192,0.8))" : "none"
                    }} 
                    transition={{ 
                      duration: 1, ease: 'easeOut', delay: 0.4,
                      strokeOpacity: { repeat: hoveredConst === "Obsidian Helix" ? Infinity : 0, duration: 1.2 },
                      filter: { duration: 0.3 }
                    }} 
                    x1="150" y1="150" x2="90" y2="183" 
                  /> {/* Helix (-33, 8.8h) */}
                </g>

                {/* Actual Constellation Node Markers */}
                <g>
                  {/* The Scepter of Avarice node (r=63.6, angle=180 -> x=150, y=86) */}
                  <motion.g 
                    className="cursor-pointer" 
                    onClick={() => alignToIdeal("The Scepter of Avarice")}
                    onMouseEnter={() => setHoveredConst("The Scepter of Avarice")}
                    onMouseLeave={() => setHoveredConst(null)}
                    whileHover={{ scale: 1.4, filter: 'drop-shadow(0px 0px 8px rgba(220,197,123,0.8))' }}
                    style={{ transformOrigin: '195px 105px' }}
                  >
                    <circle cx="195" cy="105" r="5" fill="#050505" stroke={selectedConst === "The Scepter of Avarice" ? "#dcc57b" : "#b76e79"} strokeWidth="1.5" />
                    <circle cx="195" cy="105" r="1.5" fill="#dcc57b" className="star-twinkle-fast" />
                    <text x="205" y="103" fontSize="5" fontFamily="var(--font-mono)" fill="#f8f5f2" fillOpacity="0.5" textAnchor="start">AVARICE</text>
                  </motion.g>

                  {/* Oxblood Eclipse node */}
                  <motion.g 
                    className="cursor-pointer" 
                    onClick={() => alignToIdeal("Oxblood Eclipse")}
                    onMouseEnter={() => setHoveredConst("Oxblood Eclipse")}
                    onMouseLeave={() => setHoveredConst(null)}
                    whileHover={{ scale: 1.4, filter: 'drop-shadow(0px 0px 8px rgba(147,0,10,0.8))' }}
                    style={{ transformOrigin: '150px 240px' }}
                  >
                    <circle cx="150" cy="240" r="5" fill="#050505" stroke={selectedConst === "Oxblood Eclipse" ? "#dcc57b" : "#b76e79"} strokeWidth="1.5" />
                    <circle cx="150" cy="240" r="1.5" fill="#93000a" className="star-twinkle-normal" />
                    <text x="150" y="252" fontSize="5" fontFamily="var(--font-mono)" fill="#f8f5f2" fillOpacity="0.5" textAnchor="middle">OXBLOOD</text>
                  </motion.g>

                  {/* Platinum Spire node */}
                  <motion.g 
                    className="cursor-pointer" 
                    onClick={() => alignToIdeal("Platinum Spire")}
                    onMouseEnter={() => setHoveredConst("Platinum Spire")}
                    onMouseLeave={() => setHoveredConst(null)}
                    whileHover={{ scale: 1.4, filter: 'drop-shadow(0px 0px 8px rgba(255,255,255,0.8))' }}
                    style={{ transformOrigin: '150px 80px' }}
                  >
                    <circle cx="150" cy="80" r="5" fill="#050505" stroke={selectedConst === "Platinum Spire" ? "#dcc57b" : "#b76e79"} strokeWidth="1.5" />
                    <circle cx="150" cy="80" r="1.5" fill="#ffffff" className="star-twinkle-slow" />
                    <text x="150" y="72" fontSize="5" fontFamily="var(--font-mono)" fill="#f8f5f2" fillOpacity="0.5" textAnchor="middle">SPIRE</text>
                  </motion.g>

                  {/* The Silent Lion node */}
                  <motion.g 
                    className="cursor-pointer" 
                    onClick={() => alignToIdeal("The Silent Lion")}
                    onMouseEnter={() => setHoveredConst("The Silent Lion")}
                    onMouseLeave={() => setHoveredConst(null)}
                    whileHover={{ scale: 1.4, filter: 'drop-shadow(0px 0px 8px rgba(183,110,121,0.8))' }}
                    style={{ transformOrigin: '260px 180px' }}
                  >
                    <circle cx="260" cy="180" r="5" fill="#050505" stroke={selectedConst === "The Silent Lion" ? "#dcc57b" : "#b76e79"} strokeWidth="1.5" />
                    <circle cx="260" cy="180" r="1.5" fill="#b76e79" className="star-twinkle-fast" />
                    <text x="260" y="172" fontSize="5" fontFamily="var(--font-mono)" fill="#f8f5f2" fillOpacity="0.5" textAnchor="middle">LION</text>
                  </motion.g>

                  {/* Obsidian Helix node */}
                  <motion.g 
                    className="cursor-pointer" 
                    onClick={() => alignToIdeal("Obsidian Helix")}
                    onMouseEnter={() => setHoveredConst("Obsidian Helix")}
                    onMouseLeave={() => setHoveredConst(null)}
                    whileHover={{ scale: 1.4, filter: 'drop-shadow(0px 0px 8px rgba(209,204,192,0.8))' }}
                    style={{ transformOrigin: '90px 183px' }}
                  >
                    <circle cx="90" cy="183" r="5" fill="#050505" stroke={selectedConst === "Obsidian Helix" ? "#dcc57b" : "#b76e79"} strokeWidth="1.5" />
                    <circle cx="90" cy="183" r="1.5" fill="#d1ccc0" className="star-twinkle-slow" />
                    <text x="80" y="181" fontSize="5" fontFamily="var(--font-mono)" fill="#f8f5f2" fillOpacity="0.5" textAnchor="end">HELIX</text>
                  </motion.g>
                </g>

                {/* Central singularity hub with burgundy core glow */}
                <circle cx="150" cy="150" r="12" fill="url(#coreGlow)" />
                <circle cx="150" cy="150" r="6" fill="#050505" stroke="#b76e79" strokeWidth="1" />
                <circle cx="150" cy="150" r="1.5" fill="#dcc57b" className="animate-pulse" />

                {/* Reactive Live Reticle alignment line mapping the current user set points */}
                {/* Dynamically projects coordinate selector */}
                <g>
                  {/* Crosshair target alignment indicator */}
                  <motion.circle 
                    key={`reticle-${latitude.toFixed(1)}-${ascension.toFixed(1)}`}
                    cx="150" 
                    cy="150" 
                    r={Math.min(136, Math.abs(50 + (latitude + 180) * 0.25))} 
                    fill="none" 
                    stroke="#fff" 
                    strokeWidth="0.5" 
                    strokeOpacity="0.1"
                    initial={{ strokeWidth: 2, strokeOpacity: 0.6 }}
                    animate={{ strokeWidth: 0.5, strokeOpacity: 0.1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  <circle 
                    cx="150" 
                    cy="150" 
                    r={Math.min(136, Math.abs(50 + (latitude + 180) * 0.25))} 
                    fill="none" 
                    stroke="#fff" 
                    strokeWidth="0.5" 
                    strokeOpacity="0.1" 
                  />
                </g>

                {/* Definitions for gradient cores */}
                <defs>
                  <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#93000a" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#93000a" stopOpacity="0" />
                  </radialGradient>
                  
                  <radialGradient id="radarScan" cx="50%" cy="50%" r="50%" fx="50%" fy="0%">
                    <stop offset="0%" stopColor="#dcc57b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#dcc57b" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>

              {/* Center pointer coordination tag */}
              <div className="absolute font-mono text-[7px] text-[#dcc57b]/50 bottom-2 bg-void/80 px-2 py-0.5 border border-[#b76e79]/10 pointer-events-none uppercase">
                LAT_ {latitude}° // RA_ {ascension}h
              </div>
            </div>

            {/* Instruction plate */}
            <div className="mt-8 text-center max-w-xs pointer-events-none">
              <span className="font-mono text-[8px] text-ivory/30 uppercase tracking-[0.3em]">
                * Click on the astrolabe map grid to directly align coordinates.
              </span>
            </div>

          </div>

          {/* Column C: The Navigation Ledger & Oracle Prophecy (span 4) */}
          <motion.div 
            animate={isPlotting ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] } : {}}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="lg:col-span-4 flex flex-col justify-between border border-[#b76e79]/20 bg-[#050505] p-8 md:p-10 relative overflow-hidden shadow-[0_0_60px_rgba(147,0,10,0.15)] bg-gradient-to-b from-void via-void to-[#93000a]/3"
          >
            
            {/* Elegant glowing background border effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#93000a]/5 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#b76e79]/5 blur-2xl pointer-events-none" />

            <div className="space-y-8">
              <div className="border-b border-[#b76e79]/10 pb-6 flex justify-between items-end">
                <div>
                  <span className="font-mono text-[8px] text-[#b76e79]/60 tracking-[0.5em] block mb-2 uppercase">Nav_Output_Records</span>
                  <h3 className="font-serif text-2xl text-ivory tracking-tight italic">Trajectory Ledger</h3>
                </div>
                
                {/* Distortion Gauge */}
                <div className="flex flex-col items-end">
                  <span className="font-mono text-[7px] text-ivory/30 tracking-widest uppercase">DISTORTION</span>
                  <span className={`font-mono text-sm tracking-tighter ${result && result.distortion < 8 ? "text-[#dcc57b]" : "text-ivory"}`}>
                    {result ? result.distortion.toFixed(1) : "0.0"}
                  </span>
                </div>
              </div>

              {/* Main Ledger Content */}
              <div className="space-y-6">
                
                <AnimatePresence mode="wait">
                  {!result ? (
                    <motion.div 
                      key="waiting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <Compass className="w-12 h-12 text-ivory/20 animate-pulse" />
                      <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-ivory/40">
                        [ AWAITING VECTOR PLOT_ ]
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="space-y-6"
                    >
                      
                      {/* Metric lines */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-ivory/5 bg-ivory/[0.01] p-4 text-left">
                          <div className="flex items-center gap-2 mb-1 opacity-40">
                            <Clock className="w-3.5 h-3.5 text-[#b76e79]" />
                            <span className="font-mono text-[8px] tracking-[0.2em] uppercase">Cycles</span>
                          </div>
                          <span className="font-serif text-3xl text-ivory leading-none font-light">
                            {result.travelCycles}
                          </span>
                        </div>

                        <div className="border border-ivory/5 bg-ivory/[0.01] p-4 text-left">
                          <div className="flex items-center gap-2 mb-1 opacity-40">
                            <ShieldAlert className="w-3.5 h-3.5 text-[#93000a]" />
                            <span className="font-mono text-[8px] tracking-[0.2em] uppercase">Anomaly</span>
                          </div>
                          <span className="font-serif text-3xl text-ivory leading-none font-light">
                            {result.encounterChance}%
                          </span>
                        </div>
                      </div>

                      {/* Align Status Indicator */}
                      <div className="border-l-[1.5px] border-[#b76e79]/60 pl-4 py-1">
                        <span className="font-mono text-[8px] text-ivory/40 tracking-[0.3em] block uppercase mb-1">Trajectory Status</span>
                        <span className={`font-mono text-[10px] tracking-wider uppercase ${result.isPerfect ? "text-[#dcc57b]" : "text-ivory"}`}>
                          {result.statusText}
                        </span>
                      </div>

                      {/* Predicted Encounter */}
                      <div className="border-l-[1.5px] border-[#93000a] pl-4 py-1">
                        <span className="font-mono text-[8px] text-ivory/40 tracking-[0.3em] block uppercase mb-1">Sector Threat Event</span>
                        <span className="font-sans text-xs text-ivory/80">
                          {result.encounterType}
                        </span>
                      </div>

                      {/* Resource Sizing */}
                      <div className="border-l-[1.5px] border-ivory/20 pl-4 py-1">
                        <span className="font-mono text-[8px] text-ivory/40 tracking-[0.3em] block uppercase mb-1">Energy Matrix Draw</span>
                        <span className="font-mono text-[9px] text-[#dcc57b] tracking-wider uppercase">
                          {result.resourceDetails}
                        </span>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>

            {/* Oracle Verdict Display (Parchment scroll effect) */}
            <div className="mt-8 border-t border-[#b76e79]/10 pt-6">
              <span className="font-mono text-[8px] text-[#b76e79]/60 tracking-[0.5em] block mb-4 uppercase">Sacred_Oracle_Decree</span>
              <div className="bg-[#93000a]/5 border border-[#93000a]/20 p-5 relative overflow-hidden backdrop-blur-sm">
                
                {/* Intense light sweep effect on prophecy load */}
                {result && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 1.5, ease: 'linear' }}
                    className="absolute inset-0 w-[50%] bg-gradient-to-r from-transparent via-[#dcc57b]/20 to-transparent pointer-events-none -z-1" 
                    style={{ transform: 'skewX(-20deg)' }}
                  />
                )}

                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none z-0">
                  <span className="font-serif italic text-6xl text-[#93000a]">V</span>
                </div>
                
                <AnimatePresence mode="wait">
                  {!result ? (
                    <motion.p 
                      key="oracle-waiting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      className="font-serif italic text-sm text-ivory/30 leading-relaxed"
                    >
                      &ldquo;Align the coordinates of the sovereign. Transmit the vectors to awaken the oracle&apos;s prophetic vision.&rdquo;
                    </motion.p>
                  ) : (
                    <motion.div
                      key="oracle-prophecy"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08 } },
                      }}
                      className="space-y-2"
                    >
                      <p className="font-serif italic text-sm md:text-base text-ivory/90 leading-relaxed leading-[1.6]">
                        &ldquo;
                        {result.prophecy.split(" ").map((word, i) => (
                          <motion.span
                            key={i}
                            variants={{
                              hidden: { opacity: 0, filter: 'blur(4px)' },
                              visible: { opacity: 1, filter: 'blur(0px)' }
                            }}
                            className="inline-block mr-1"
                          >
                            {word}
                          </motion.span>
                        ))}
                        &rdquo;
                      </p>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: result.prophecy.split(" ").length * 0.08 + 0.5, duration: 1 }}
                        className="flex justify-between items-center text-[7px] font-mono text-[#b76e79] tracking-[0.4em] uppercase pt-2"
                      >
                        <span>Cleared Node: {result.constellation.slice(0, 3).toUpperCase()}_{Math.floor(result.distortion)}</span>
                        <span>[ TRANSITION_SECURE ]</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
