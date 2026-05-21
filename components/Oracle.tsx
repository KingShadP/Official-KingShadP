"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";

export function Oracle() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{role: 'user'|'oracle', text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    setQuery("");
    setHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      
      setHistory(prev => [...prev, { role: 'oracle', text: data.text }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'oracle', text: "Signal lost. The connection to the archive has faded." }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  return (
    <section id="oracle" className="py-24 px-6 md:px-12 relative flex items-center justify-center min-h-[80vh] border-t border-ivory/5">
      <div className="w-full max-w-5xl mx-auto flex flex-col h-[70vh]">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center pb-8 border-b border-ivory/10 mb-8 shrink-0">
          <div className="flex gap-4 items-center">
             <div className="w-2 h-2 bg-ivory rounded-full animate-pulse" />
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ivory/60">Oracle Kernel v0.3</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ivory/30 hidden sm:block">Awaiting Query</span>
        </div>

        {/* Content Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto mb-8 pr-4 space-y-12 scrollbar-hide scroll-smooth"
        >
          {history.length === 0 ? (
             <div className="h-full flex flex-col justify-end pb-12 opacity-50 space-y-6">
                <span className="font-serif text-3xl md:text-5xl text-ivory font-light leading-tight w-full max-w-2xl">
                  Submit your inquiry to the archive. The system is listening.
                </span>
             </div>
          ) : (
            <AnimatePresence initial={false}>
              {history.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                   <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-ivory/30 mb-4 ml-1">
                     {msg.role === 'user' ? 'Guest' : 'System'}
                   </span>
                   {msg.role === 'user' ? (
                      <p className="font-serif text-2xl md:text-4xl text-ivory/80 leading-relaxed max-w-3xl text-right">
                        {msg.text}
                      </p>
                   ) : (
                      <p className="font-sans font-light text-lg md:text-xl text-ivory/90 leading-relaxed max-w-3xl whitespace-pre-wrap">
                        {msg.text}
                      </p>
                   )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-start w-full"
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-ivory/30 mb-4 ml-1">
                     System
                  </span>
                  <div className="flex gap-2 items-center h-8">
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-ivory rounded-full" />
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-ivory rounded-full" />
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-ivory rounded-full" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Input Area */}
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center shrink-0 w-full group"
        >
          <div className="absolute left-0 bottom-0 w-full h-[1px] bg-ivory/20 group-focus-within:bg-ivory/60 transition-colors duration-700" />
          <span className="font-mono text-xs text-ivory/50 mr-6 tracking-widest uppercase shrink-0">{'>'}</span>
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="" 
            className="bg-transparent outline-none text-ivory font-serif text-2xl md:text-4xl w-full py-4 transition-all duration-500 placeholder:text-transparent"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
          <button 
            type="submit" 
            disabled={!query.trim() || isLoading}
            className="absolute right-0 pr-4 h-full flex items-center text-ivory/40 hover:text-ivory transition-colors disabled:opacity-20"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Transmit</span>
          </button>
        </form>
      </div>
    </section>
  );
}
