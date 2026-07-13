"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Cpu, Sparkles, HelpCircle, ArrowRight, BookOpen } from "lucide-react";

type SearchResultItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  contentType: string;
  category: string;
  price?: string;
  specs?: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [articles, setArticles] = useState<SearchResultItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "SEARCH SYSTEM: DEPLOY_NODE_STANDBY",
    "AWAITING OPERATOR INPUT VECTOR..."
  ]);

  useEffect(() => {
    if (query.trim() === "") {
      setArticles([]);
      setProducts([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setSystemLogs(prev => [...prev.slice(-3), `QUERY COMMITTED: "${query.toUpperCase()}"`, "COMPILING DIRECTORY PATHS..."]);
      
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        if (data.success) {
          setArticles(data.articles || []);
          setProducts(data.products || []);
          setSystemLogs(prev => [
            ...prev.slice(-3), 
            `QUERY RESOLVED successfully`, 
            `RETRIEVED ${data.articles?.length || 0} LORE MODULES`, 
            `RETRIEVED ${data.products?.length || 0} APPAREL SHIELDS`
          ]);
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const viewTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <motion.div {...viewTransition} className="flex flex-col gap-12 mt-6">
      
      {/* Title */}
      <div className="border-b border-[#dcc57b]/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-3">
          <div className="font-mono text-[10px] text-[#93000a] uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CENTRAL DIRECTORY RETRIEVAL MATRIX</span>
          </div>
          <h1 className="font-serif text-5xl font-light text-white">
            Search.
          </h1>
          <p className="font-sans text-sm text-white/60 font-light max-w-xl leading-relaxed mt-1">
            Access approved entries, specifications, lore chapters, and logistical protocols. Search parameters are factual and grounded securely inside our SQL database nodes.
          </p>
        </div>

        {/* Telemetry Console */}
        <div className="w-full md:w-80 bg-[#0c0a09]/80 border border-[#dcc57b]/20 p-4 rounded-xl font-mono text-[8px] text-white/50 flex flex-col gap-1 text-left select-none leading-normal">
          <span className="text-[#dcc57b] font-bold border-b border-white/5 pb-1 mb-1 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#93000a]" /> TELEMETRY LOGS
          </span>
          {systemLogs.map((log, index) => (
            <div key={index} className="truncate">
              <span className="text-[#93000a] mr-1">&gt;</span> {log}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ENTER KEYWORDS (e.g., Hoodie, Shipping, Miami, Restraint)"
          className="w-full bg-[#0c0a09]/70 border border-[#dcc57b]/30 rounded-xl py-4.5 pl-12 pr-6 font-mono text-xs uppercase tracking-widest text-white outline-none focus:border-[#dcc57b] focus:ring-1 focus:ring-[#dcc57b]/25 transition-all text-left shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
          aria-label="Search parameters"
        />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-12 mt-4 text-left">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20 font-mono text-[10px] text-[#dcc57b] uppercase tracking-[0.2em] gap-2"
            >
              <Cpu className="w-4 h-4 animate-spin text-[#93000a]" /> DECOMPRESSING DATABASES...
            </motion.div>
          ) : query.trim() !== "" && articles.length === 0 && products.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col justify-center items-center py-24 gap-4 text-center"
            >
              <HelpCircle className="w-12 h-12 text-[#93000a]" />
              <h3 className="font-serif text-2xl text-white font-light italic">No Approved Matches</h3>
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest max-w-md mt-1 leading-relaxed">
                Logistics core returned zero approved entries for your keyword criteria. Try searching for &quot;garment&quot;, &quot;shipping&quot;, or &quot;identity&quot;.
              </p>
            </motion.div>
          ) : (
            <motion.div key="results" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Lore Articles Section */}
              {articles.length > 0 && (
                <div className="flex flex-col gap-6">
                  <h3 className="font-mono text-[10px] text-[#dcc57b]/60 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#dcc57b]" /> LORE & LOGISTICAL FILES ({articles.length})
                  </h3>
                  <div className="flex flex-col gap-4">
                    {articles.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-[#0c0a09]/50 border border-white/10 hover:border-[#dcc57b]/30 p-6 rounded-xl flex flex-col gap-3 transition-colors text-left group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[8px] text-[#93000a] uppercase tracking-wider font-bold">{item.category}</span>
                          <span className="font-mono text-[8px] text-white/35 uppercase border border-white/5 px-2 py-0.5 rounded-sm">{item.contentType}</span>
                        </div>
                        <h4 className="font-serif text-2xl text-white font-normal group-hover:text-[#dcc57b] transition-colors">{item.title}</h4>
                        <p className="font-sans text-xs text-white/60 leading-relaxed font-light">{item.summary || item.body.slice(0, 150)}</p>
                        <div className="border-t border-white/5 pt-3 mt-1 text-[10px] font-mono text-white/40 leading-relaxed max-h-24 overflow-y-auto font-light bg-black/10 p-2.5 rounded">
                          {item.body}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {products.length > 0 && (
                <div className="flex flex-col gap-6">
                  <h3 className="font-mono text-[10px] text-[#dcc57b]/60 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#dcc57b]" /> DESIGN MODULES ({products.length})
                  </h3>
                  <div className="flex flex-col gap-4">
                    {products.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-[#0c0a09]/50 border border-white/10 hover:border-[#dcc57b]/30 p-6 rounded-xl flex flex-col gap-3 transition-colors text-left group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[8px] text-[#dcc57b] uppercase tracking-wider font-bold">{item.category}</span>
                          <span className="font-mono text-[11px] text-[#dcc57b] font-semibold">{item.price}</span>
                        </div>
                        <h4 className="font-serif text-2xl text-white font-normal group-hover:text-[#dcc57b] transition-colors">{item.title}</h4>
                        <p className="font-sans text-xs text-white/60 leading-relaxed font-light">{item.body || item.description}</p>
                        
                        <div className="border-t border-white/5 pt-3 mt-1 flex flex-col gap-1">
                          <span className="font-mono text-[8px] uppercase tracking-wider text-white/35">Drape Specs:</span>
                          <span className="font-mono text-[9px] text-[#dcc57b] font-medium">{item.specs}</span>
                        </div>

                        <a 
                          href="/fashion"
                          className="mt-3 inline-flex items-center gap-2 font-mono text-[9px] text-white/50 group-hover:text-[#dcc57b] uppercase tracking-widest font-semibold hover:tracking-widest transition-all"
                        >
                          Acquire Module <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
