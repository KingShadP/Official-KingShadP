"use client";

import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { X, Vault, Fingerprint, Activity, Bookmark, Clock, Share2, Check } from "lucide-react";

interface CardData {
  id: string;
  classification: string;
  title: string;
  content: string;
  image?: string;
}

const CLASSIFICATION_COLORS: Record<string, string> = {
  "Manifesto": "59, 130, 246", // Blue
  "Visual Code": "139, 92, 246", // Violet
  "Aural Grid": "16, 185, 129", // Emerald
  "Identity": "220, 197, 123", // Gold
};

export const ArtifactCard = memo(function ArtifactCard({ data, index }: { data: CardData, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem(`kingshadp_bookmark_${data.id}`);
    setIsBookmarked(value === "true");
  }, [data.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !isBookmarked;
    setIsBookmarked(nextVal);
    localStorage.setItem(`kingshadp_bookmark_${data.id}`, nextVal ? "true" : "false");
  };

  const wordCount = data.content.split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.ceil((wordCount / 200) * 60);
  const readingTimeStr = estimatedSeconds < 60 ? `${estimatedSeconds}s read` : `${Math.ceil(estimatedSeconds / 60)}m read`;

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const hoverActive = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const hoverSpring = useSpring(hoverActive, { damping: 15, stiffness: 150 });
  
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [0, 1], [10, -10]);
  const rotateY = useTransform(xSpring, [0, 1], [-10, 10]);

  const shadowX = useTransform(xSpring, [0, 1], [20, -20]);
  const shadowY = useTransform(ySpring, [0, 1], [20, -20]);

  // Depth-mapped text elements
  const textX = useTransform(xSpring, [0, 1], [18, -18]);
  const textY = useTransform(ySpring, [0, 1], [18, -18]);
  const titleX = useTransform(xSpring, [0, 1], [35, -35]);
  const titleY = useTransform(ySpring, [0, 1], [35, -35]);

  const shadowStrength = useTransform(hoverSpring, [0, 1], [0, 0.4]);
  const darkShadowStrength = useTransform(hoverSpring, [0, 1], [0.3, 0.8]);

  const baseColorRGB = CLASSIFICATION_COLORS[data.classification] || "220, 197, 123";
  const glowColorRGB = isBookmarked ? "220, 197, 123" : baseColorRGB;

  const boxShadow = useMotionTemplate`
    ${shadowX}px ${shadowY}px 40px rgba(${glowColorRGB}, ${shadowStrength}),
    ${shadowX}px ${shadowY}px 80px rgba(0, 0, 0, ${darkShadowStrength})
  `;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    x.set((e.clientX - rect.left) / width);
    y.set((e.clientY - rect.top) / height);
    hoverActive.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    hoverActive.set(0);
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(true)}
        className={`group relative h-80 sm:h-96 p-8 bg-void/50 backdrop-blur-xl cursor-pointer flex flex-col justify-between transition-[border-color,background-color] duration-500 rounded-sm overflow-visible ${
          isBookmarked 
            ? 'border-2 border-gold outline outline-1 outline-offset-4 outline-gold/30 bg-gradient-to-b from-[#0e0c08] via-void to-void' 
            : 'border-2 border-ivory/5 hover:border-ivory/20'
        }`}
        style={{
          borderColor: isBookmarked ? undefined : `rgba(${glowColorRGB}, 0.25)`,
          transformStyle: "preserve-3d",
          perspective: "1200px",
          rotateX,
          rotateY,
          boxShadow,
        }}
      >
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" style={{ transform: "translateZ(1px)" }} />
        
        {/* Heartbeat Pulse Overlay */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 3 + index * 0.2, // Offset rhythms
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden"
          style={{
            background: `radial-gradient(circle at center, rgba(${baseColorRGB}, 0.8) 0%, transparent 65%)`,
            transform: "translateZ(2px)"
          }}
        />

        {/* Extreme Tactical Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: `rgb(${glowColorRGB})`, transform: "translateZ(35px)" }} />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: `rgb(${glowColorRGB})`, transform: "translateZ(35px)" }} />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: `rgb(${glowColorRGB})`, transform: "translateZ(35px)" }} />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: `rgb(${glowColorRGB})`, transform: "translateZ(35px)" }} />

        {/* Scanline / matrix inner overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMjIyMiIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwMCIvPjwvc3ZnPg==')] opacity-0 group-hover:opacity-10 mix-blend-overlay transition-opacity duration-700 pointer-events-none" style={{ transform: "translateZ(5px)" }} />

        {/* Floating Bookmark Pin */}
        <button
          onClick={toggleBookmark}
          className={`absolute top-6 right-6 z-50 p-2.5 rounded-full border bg-void/90 backdrop-blur-md transition-all duration-300 shadow-xl overflow-hidden hover:scale-110 ${
            isBookmarked 
              ? 'border-gold shadow-[0_0_15px_rgba(220,197,123,0.5)]' 
              : 'border-ivory/10 hover:border-ivory/50'
          }`}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark Entry"}
          style={{ transform: "translateZ(45px)" }}
        >
          <Bookmark className={`w-4 h-4 transition-colors ${isBookmarked ? "fill-gold text-gold" : "text-ivory/50"}`} />
        </button>
        
        <motion.div style={{ x: textX, y: textY, z: 85 }} className="relative z-10 pointer-events-none">
          <span 
            className="font-mono text-[11px] uppercase tracking-[0.4em] font-bold drop-shadow-[0_0_8px_rgba(0,0,0,1)]"
            style={{ color: `rgb(${baseColorRGB})` }}
          >
            {data.classification}
          </span>
          <motion.h3 
            style={{ x: titleX, y: titleY, z: 140 }}
            className="font-serif text-4xl text-ivory mt-4 font-light leading-none group-hover:text-ivory transition-colors duration-300 drop-shadow-[0_0_15px_rgba(0,0,0,1)]"
          >
            {data.title}
          </motion.h3>
        </motion.div>

        {/* Dynamic Card Actions & Reading Metadata */}
        <motion.div style={{ x: textX, y: textY, z: 65 }} className="flex justify-between items-center border-t border-ivory/15 pt-5 pointer-events-none relative z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-ivory/70 uppercase tracking-widest drop-shadow-md font-bold">{data.id}</span>
            <span className="text-ivory/30 font-mono text-[8px]">•</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory/5 border border-ivory/20 font-mono text-[9px] text-ivory tracking-wider shadow-md backdrop-blur-md">
              <Clock className="w-3 h-3 text-gold" />
              <span>{readingTimeStr}</span>
            </div>
          </div>
          <Activity className="w-5 h-5 text-ivory/40 transition-colors" style={{ color: hoverActive.get() ? `rgb(${baseColorRGB})` : undefined }} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && <Modal data={data} onClose={() => setIsOpen(false)} baseColorRGB={baseColorRGB} />}
      </AnimatePresence>
    </>
  );
});

export function Modal({ data, onClose, baseColorRGB }: { data: CardData, onClose: () => void, baseColorRGB: string }) {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?vault=${data.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    if (scrollHeight > 0) {
      const progress = target.scrollTop / scrollHeight;
      setScrollProgress(progress * 100);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8 bg-void/70"
    >
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <motion.div
        initial={{ y: 100, scale: 0.9, rotateX: 15 }}
        animate={{ y: 0, scale: 1, rotateX: 0 }}
        exit={{ y: -60, scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 1 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.6, bottom: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.y < -150 || info.velocity.y < -500) {
            onClose();
          }
        }}
        onScroll={handleScroll}
        className="relative w-full max-w-5xl max-h-[85vh] bg-[#030303] border overflow-y-auto shadow-[0_0_150px_rgba(0,0,0,0.95)] perspective-1200 flex flex-col"
        style={{ borderColor: `rgba(${baseColorRGB}, 0.3)` }}
      >
        {/* Dynamic Scanline Wipe Animation Overlay */}
        <motion.div
          initial={{ scaleY: 1, originY: 0 }}
          animate={{ scaleY: 0, originY: 0 }}
          transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-[0_0_auto_0] w-full h-full bg-gradient-to-b from-[#110e0c] via-oxblood/30 to-transparent pointer-events-none z-[100] border-b-2 border-gold/60 shadow-[0_4px_30px_rgba(220,197,123,0.35)]"
        />

        <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-noise opacity-40 z-0" />
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay crt-scanlines opacity-60 z-0" />

        <div className="relative p-8 sm:p-14 md:p-20 z-10 flex-1 flex flex-col min-h-max">
          <div className="absolute top-8 right-8 flex items-center gap-4 z-50">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 border border-gold/30 bg-void/85 px-4 py-2 font-mono text-[9px] tracking-[0.25em] text-gold uppercase transition-all hover:bg-gold/10 hover:border-gold hover:shadow-[0_0_15px_rgba(220,197,123,0.3)] duration-300 rounded-sm"
              title="Copy direct share link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-gold animate-bounce" />
                  <span className="hidden sm:inline">Copied to System</span>
                  <span className="sm:hidden inline text-gold font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-gold" />
                  <span className="hidden sm:inline">Transmit Link</span>
                  <span className="sm:hidden inline">Share</span>
                </>
              )}
            </button>

            <button onClick={onClose} className="text-ivory/50 hover:text-ivory transition-transform hover:scale-125 mix-blend-difference drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="mb-16 pb-12 border-b border-ivory/15 pr-12">
            <div className="flex items-center gap-4 mb-8 font-mono text-xs sm:text-sm text-ivory/60 tracking-[0.4em] uppercase">
              <Vault className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" style={{ color: `rgb(${baseColorRGB})` }} />
              <span className="font-bold drop-shadow-md" style={{ color: `rgb(${baseColorRGB})` }}>Vault Entry // {data.id}</span>
            </div>
            <h2 className="font-serif text-6xl sm:text-7xl md:text-8xl text-ivory font-light italic leading-[0.95] drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              {data.title}
            </h2>
          </div>

          <div className="prose prose-invert max-w-none font-serif text-2xl sm:text-3xl md:text-4xl font-light text-ivory/90 leading-[1.6] mb-8 drop-shadow-lg">
            {data.content}
          </div>
          
          {data.image && (
            <div className="w-full relative aspect-square md:aspect-video mb-20 border border-ivory/20 overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center mix-blend-luminosity hover:mix-blend-normal transition-all duration-[2s] hover:scale-105" 
                style={{ backgroundImage: `url('${data.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent opacity-50 pointer-events-none" />
            </div>
          )}

          <div className="mt-auto bg-void/60 p-8 sm:p-12 border border-ivory/15 flex flex-col sm:flex-row items-center sm:items-start gap-8 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] pointer-events-none" />
            <Fingerprint className="w-12 h-12 shrink-0 opacity-90 drop-shadow-[0_0_15px_rgba(0,0,0,1)]" style={{ color: `rgb(${baseColorRGB})` }} />
            <p className="font-sans text-base sm:text-lg text-ivory/70 font-light leading-relaxed max-w-3xl text-center sm:text-left drop-shadow-md">
              This module has been synthetically verified by the KingShadP origin system. Access is logged. Do not replicate without sovereign clearance.
            </p>
          </div>
        </div>

        {/* Anchor bottom progress bar */}
        <div className="sticky bottom-0 left-0 right-0 h-2 bg-void z-50 overflow-hidden border-t border-ivory/10">
          <div 
            className="h-full transition-all duration-150 ease-out shadow-[0_-3px_15px_rgba(0,0,0,0.5)]" 
            style={{ 
              width: `${scrollProgress}%`,
              background: `linear-gradient(90deg, rgba(${baseColorRGB}, 0.5), rgb(${baseColorRGB}))`,
              boxShadow: `0 0 15px rgba(${baseColorRGB}, 0.8)`
            }} 
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
