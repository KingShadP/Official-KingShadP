"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import { TypeWriterText } from "@/components/TypeWriterText";

export function Oracle() {
  const [hovered, setHovered] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{role: 'user'|'oracle', text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    setQuery("");
    setHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      
      setHistory(prev => [...prev, { role: 'oracle', text: data.text }]);
      setResponse(data.text);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'oracle', text: "The signal is lost. Try your invocation again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  return (
    <section id="oracle" className="py-40 px-6 relative border-t border-rosegold/10 from-void to-oxblood/40 bg-gradient-to-b flex items-center justify-center min-h-[80vh] overflow-hidden velvet-section">
      <div className="absolute inset-0 atmosphere opacity-50 pointer-events-none" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 border-x border-rosegold/5 max-w-[80rem] mx-auto hidden md:block pointer-events-none">
        <div className="w-full h-full border-x border-rosegold/5 absolute left-1/3" />
        <div className="w-full h-full border-x border-rosegold/5 absolute right-1/3" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full z-10 glass-panel crimson-glass p-8 md:p-16 rounded-[40px] relative border-rosegold/20 flex flex-col items-center velvet-shadow"
      >
        <div className="absolute top-8 left-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-crimson shadow-[0_0_10px_#B21F36] animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-rosegold/20" />
          <div className="w-2 h-2 rounded-full bg-rosegold/20" />
        </div>
        
        <div className="absolute top-8 right-8 font-mono text-[9px] uppercase tracking-[0.3em] text-rosegold/50">
          OS_VERSION_002
        </div>

        <div className="flex flex-col items-center text-center mt-8 w-full">
          <span className="font-sans text-[10px] tracking-[0.4em] text-gold uppercase mb-6 drop-shadow-md">
            The Oracle Interface
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-ivory mb-12 font-light">
            Consult The <span className="italic text-rosegold">Archive</span>
          </h2>
          
          <div className="w-full max-w-2xl bg-void/50 border border-rosegold/10 rounded-3xl overflow-hidden velvet-shadow flex flex-col mb-8" style={{ height: '400px' }}>
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <div className="w-12 h-12 border border-rosegold/20 rounded-full flex items-center justify-center rotate-45 group">
                    <span className="font-serif text-[10px] text-rosegold -rotate-45">G</span>
                  </div>
                  <p className="font-mono text-[9px] text-ivory tracking-widest uppercase max-w-xs">
                    "Power is only beautiful when it has discipline."
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {history.map((msg, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-rosegold/10 text-ivory rounded-tr-sm border border-rosegold/20' : 'bg-transparent text-ivory/80 border-l border-rosegold/40 rounded-tl-sm'}`}>
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-rosegold/60 mb-2">
                          {msg.role === 'user' ? 'GUEST_INPUT' : 'SYSTEM_RESPONSE'}
                        </span>
                        {msg.role === 'oracle' ? (
                          <TypeWriterText text={msg.text} className="font-serif text-lg italic text-platinum drop-shadow-md leading-relaxed" />
                        ) : (
                          <p className="font-serif leading-relaxed text-sm">
                            {msg.text}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex w-full justify-start"
                    >
                      <div className="bg-transparent border-l border-rosegold/40 px-4 py-3 flex items-center">
                         <span className="font-mono text-[8px] uppercase tracking-widest text-rosegold/60 mr-4">SYSTEM_THINKING</span>
                         <div className="flex gap-1.5 items-center">
                           <motion.div 
                             animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} 
                             transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} 
                             className="w-[3px] h-[3px] rounded-full bg-gold/80" 
                           />
                           <motion.div 
                             animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} 
                             transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} 
                             className="w-[3px] h-[3px] rounded-full bg-gold/80" 
                           />
                           <motion.div 
                             animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} 
                             transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} 
                             className="w-[3px] h-[3px] rounded-full bg-gold/80" 
                           />
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            <form 
              onSubmit={handleSubmit}
              className={`w-full flex items-center bg-void/90 border-t transition-all duration-700 px-4 py-4 ${hovered ? 'border-rosegold/60 shadow-[0_-10px_30px_rgba(183,110,121,0.05)]' : 'border-rosegold/20'}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <span className="font-mono text-[10px] text-rosegold/80 mr-4 tracking-widest uppercase hidden sm:block">Input_</span>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Submit your inquiry..." 
                className="bg-transparent border-none outline-none text-ivory font-serif text-lg w-full placeholder:text-ivory/30 placeholder:italic transition-all duration-500"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!query.trim() || isLoading}
                className="w-10 h-10 shrink-0 rounded-full border border-rosegold/30 flex items-center justify-center text-rosegold hover:bg-rosegold hover:text-void transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-rosegold"
              >
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
