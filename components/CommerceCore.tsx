"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ShoppingCart, Terminal, Code, Settings, Layers } from "lucide-react";

const SHOPIFY_CSS = `/*
 * KINGSHADP. SOVEREIGN COMMERCE PROTOCOL
 * Core Injection Layer (Dawn / Premium Shopify Themes)
 * Architecture: Omni-Platform CSS Overrides
 *
 * STEP 1: In your Shopify Admin, go to Online Store > Themes > Edit code
 * STEP 2: Open the 'Assets' folder, click 'Add a new asset', and create a blank file named 'kingshadp-theme.css'
 * STEP 3: Paste all of this code into that new file and Save.
 */

:root {
  --ks-oxblood: #5e0008;
  --ks-oxblood-light: #93000a;
  --ks-gold: #dcc57b;
  --ks-void: #030303;
  --ks-void-elevated: #0a0a0a;
  --ks-ivory: #f4f1eb;
}

body, .color-background-1, .gradient {
  background-color: var(--ks-void) !important;
  color: var(--ks-ivory) !important;
  cursor: none !important; /* Sovereign Custom Cursor Active */
}

/* Typography Override & Scale */
h1, h2, h3, h4, h5, .h0, .h1, .h2, .h3, .h4, .h5, a, .cart-item__name {
  font-family: 'Playfair Display', serif !important;
  font-weight: 300 !important;
  color: var(--ks-ivory) !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Price & Meta Typography */
.price-item, .price, .badge, .cart-item__details * {
  color: var(--ks-gold) !important;
  font-family: 'JetBrains Mono', monospace !important;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(220,197,123,0.3);
}

/* Base Buttons */
.button, .btn, .shopify-payment-button__button, .cart__checkout-button {
  background: transparent !important;
  color: var(--ks-ivory) !important;
  border: 1px solid rgba(220, 197, 123, 0.3) !important;
  border-radius: 0 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.25em !important;
  font-family: 'JetBrains Mono', monospace !important;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
  position: relative;
  overflow: hidden;
}

.button:hover, .btn:hover, .cart__checkout-button:hover {
  background: rgba(94, 0, 8, 0.15) !important;
  border-color: var(--ks-oxblood-light) !important;
  color: var(--ks-gold) !important;
  box-shadow: inset 0 0 25px rgba(147, 0, 10, 0.5), 0 0 15px rgba(147, 0, 10, 0.3) !important;
}

/* Input Fields & Selectors */
.field__input, .select__select, .customer .field input {
  background: transparent !important;
  border: 1px solid rgba(244, 240, 236, 0.1) !important;
  border-radius: 0 !important;
  color: var(--ks-ivory) !important;
  outline: none !important;
  font-family: 'JetBrains Mono', monospace !important;
  box-shadow: none !important;
}
.field__input:focus, .select__select:focus {
  border-color: var(--ks-gold) !important;
  box-shadow: inset 0 0 15px rgba(220, 197, 123, 0.15), 0 0 10px rgba(220, 197, 123, 0.1) !important;
}

/* Vault Product Cards Override */
.card-wrapper, .collection .grid__item {
  background: rgba(10, 10, 10, 0.6) !important;
  border: 1px solid rgba(244, 240, 236, 0.05) !important;
  backdrop-filter: blur(10px);
  transition: all 0.5s ease-out !important;
  transform: translateZ(0);
}
.card-wrapper:hover {
  border-color: rgba(220, 197, 123, 0.4) !important;
  box-shadow: 0 0 40px rgba(0,0,0,0.9), 0 0 20px rgba(220, 197, 123, 0.15) !important;
  transform: translateY(-5px);
}

/* Variant Selectors */
fieldset.product-form__input .form__label {
  color: var(--ks-ivory) !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.75rem;
}
fieldset.product-form__input input[type='radio'] + label {
  background-color: var(--ks-void) !important;
  color: var(--ks-ivory) !important;
  border: 1px solid rgba(244, 240, 236, 0.2) !important;
  border-radius: 0 !important;
}
fieldset.product-form__input input[type='radio']:checked + label {
  background-color: rgba(220, 197, 123, 0.1) !important;
  border-color: var(--ks-gold) !important;
  color: var(--ks-gold) !important;
  box-shadow: 0 0 10px rgba(220, 197, 123, 0.2);
}

/* CRT Scanline & Noise */
.ks-bg-noise {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none; mix-blend-mode: overlay; opacity: 0.3; z-index: 9997;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
}
.ks-crt-scanlines {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none; mix-blend-mode: overlay; opacity: 0.6; z-index: 9998;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
  background-size: 100% 3px, 3px 100%;
}
`;

const SHOPIFY_LIQUID = `{% comment %}
  KINGSHADP. SOVEREIGN COMMERCE PROTOCOL 
  
  STEP 4: Open 'theme.liquid' (usually in the 'Layout' folder).
  STEP 5: Find the </head> tag and paste this line right above it:
          {{ 'kingshadp-theme.css' | asset_url | stylesheet_tag }}
          
  STEP 6: Scroll all the way down to the bottom of the file.
  STEP 7: Paste the HTML below right BEFORE the closing </body> tag.
{% endcomment %}

<!-- Environmental Atmosphere -->
<div class="ks-bg-noise"></div>
<div class="ks-crt-scanlines"></div>

<!-- Progress Bar -->
<div id="ks-scroll-progress" style="position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg, transparent, #dcc57b, #5e0008);z-index:10000;width:0%;transition:width 0.1s;"></div>

<!-- Radar Geometry Elements -->
<div class="ks-radar-container" style="position:fixed;inset:0;pointer-events:none;z-index:0;mix-blend-mode:screen;opacity:0.1;overflow:hidden;display:flex;justify-content:center;align-items:center;">
  <div style="width:150vw;height:150vw;max-width:2000px;max-height:2000px;border:1px solid rgba(94,0,8,0.3);border-radius:50%;display:flex;justify-content:center;align-items:center;">
    <div style="width:75%;height:75%;border:1px solid rgba(94,0,8,0.2);border-radius:50%;position:absolute;"></div>
    <div style="width:50%;height:50%;border:1px dashed rgba(94,0,8,0.3);border-radius:50%;position:absolute;"></div>
    <div class="ks-radar-beam" style="width:50%;height:2px;background:linear-gradient(270deg, #93000a, transparent);position:absolute;right:50%;transform-origin:right;animation:ks-spin 6s linear infinite;"></div>
  </div>
</div>

<!-- Custom Sovereign Cursor -->
<div id="ks-cursor-dot" style="position:fixed;top:0;left:0;width:4px;height:4px;background:#f4f1eb;border-radius:50%;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);transition:width 0.2s, height 0.2s, background 0.2s, box-shadow 0.2s;"></div>
<div id="ks-cursor-ring" style="position:fixed;top:0;left:0;width:32px;height:32px;border:1px solid rgba(220,197,123,0.4);border-radius:50%;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);transition:all 0.1s ease-out;"></div>

<style>
  @keyframes ks-spin { 100% { transform: rotate(360deg); } }
</style>
`;

const SHOPIFY_JS = `/*
 * KINGSHADP. SOVEREIGN COMMERCE PROTOCOL
 * Engine Directives 
 *
 * STEP 8: You can place this code exactly as it is in your theme's main JS file (e.g., 'global.js' or 'theme.js').
 * OR, wrap it in <script> tags and paste it into 'theme.liquid' directly below the DOM elements from the previous step.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Custom Cursor Engine ---
  const dot = document.getElementById('ks-cursor-dot');
  const ring = document.getElementById('ks-cursor-ring');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  
  if (dot && ring) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = \`translate3d(\${mouseX}px, \${mouseY}px, 0)\`;
      
      const target = e.target.closest('a, button, input, .card-wrapper, select');
      if (target) {
        dot.style.width = '8px'; dot.style.height = '8px';
        dot.style.background = '#5e0008'; dot.style.boxShadow = '0 0 12px #93000a';
        ring.style.width = '56px'; ring.style.height = '56px';
        ring.style.borderColor = '#5e0008'; ring.style.background = 'rgba(94,0,8,0.15)';
      } else {
        dot.style.width = '4px'; dot.style.height = '4px';
        dot.style.background = '#f4f1eb'; dot.style.boxShadow = 'none';
        ring.style.width = '32px'; ring.style.height = '32px';
        ring.style.borderColor = 'rgba(220,197,123,0.4)'; ring.style.background = 'transparent';
      }
    }, { passive: true });

    const renderRing = () => {
      ringX += (mouseX - ringX) * 0.15; // Spring easing
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = \`translate3d(\${ringX}px, \${ringY}px, 0)\`;
      requestAnimationFrame(renderRing);
    };
    renderRing();
  }

  // --- 2. Scroll Progress ---
  const progressBar = document.getElementById('ks-scroll-progress');
  if (progressBar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPx = document.documentElement.scrollTop;
          const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          progressBar.style.width = \`\${(scrollPx / winHeightPx) * 100}%\`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- 3. Scramble Text Effect on Headings ---
  const headings = document.querySelectorAll('.card__heading, .product__title h1');
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
  headings.forEach(h => {
    const originalText = h.innerText;
    let scrambleInterval;
    h.addEventListener('mouseenter', () => {
      let iter = 0;
      clearInterval(scrambleInterval);
      scrambleInterval = setInterval(() => {
        h.innerText = originalText.split('').map((letter, i) => {
          if (letter === ' ') return ' ';
          if (i < iter) return originalText[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (iter >= originalText.length) {
          clearInterval(scrambleInterval);
          h.innerText = originalText;
        }
        iter += 1/3;
      }, 30);
    });
  });
});
`;

export const CommerceCore = memo(function CommerceCore() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'css' | 'liquid' | 'js'>('liquid');

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 3000);
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case 'css': return { content: SHOPIFY_CSS, name: "kingshadp_theme.css" };
      case 'liquid': return { content: SHOPIFY_LIQUID, name: "theme.liquid" };
      case 'js': return { content: SHOPIFY_JS, name: "theme.js" };
    }
  };

  const activeData = getActiveContent();

  return (
    <section className="relative w-full py-32 px-6 lg:px-24 z-10 border-t border-ivory/10 bg-[#040404]">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-noise opacity-20" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-ivory/20 pb-8 gap-8">
          <div>
            <h2 className="font-serif text-5xl lg:text-7xl text-ivory font-light drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Commerce Core <span className="text-gold italic drop-shadow-[0_0_10px_rgba(220,197,123,0.8)]">.</span>
            </h2>
            <p className="mt-4 text-xs md:text-sm text-ivory/50 font-mono tracking-[0.3em] uppercase">
              Omni-Platform Shopify Injection // Complete Architecture
            </p>
          </div>
          <div className="flex items-center gap-4 bg-void/50 border border-gold/30 px-6 py-4 shadow-[0_0_20px_rgba(220,197,123,0.15)]">
            <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_#dcc57b] animate-pulse" />
            <span className="font-mono text-xs text-ivory/90 tracking-widest uppercase">Full System Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Complete Syntax Vault */}
          <div className="relative group border border-ivory/15 bg-void p-1 h-[700px] flex flex-col shadow-2xl">
            {/* Syntax Tabs */}
            <div className="flex border-b border-ivory/10 bg-[#080808]">
              <button 
                onClick={() => setActiveTab('liquid')}
                className={`flex-1 py-3 px-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${activeTab === 'liquid' ? 'bg-oxblood/10 text-ivory border-b-2 border-oxblood' : 'text-ivory/40 hover:bg-ivory/5 hover:text-ivory/70'}`}
              >
                <Layers className="w-3 h-3" /> DOM (.liquid)
              </button>
              <button 
                onClick={() => setActiveTab('css')}
                className={`flex-1 py-3 px-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${activeTab === 'css' ? 'bg-ivory/5 border-b-2 border-gold text-gold drop-shadow-[0_0_5px_rgba(220,197,123,0.5)]' : 'text-ivory/40 hover:bg-ivory/5 hover:text-ivory/70'}`}
              >
                <Terminal className="w-3 h-3" /> Styles (.css)
              </button>
              <button 
                onClick={() => setActiveTab('js')}
                className={`flex-1 py-3 px-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${activeTab === 'js' ? 'bg-ivory/5 border-b-2 border-ivory text-ivory' : 'text-ivory/40 hover:bg-ivory/5 hover:text-ivory/70'}`}
              >
                <Code className="w-3 h-3" /> Logic (.js)
              </button>
            </div>

            <div className="flex justify-between items-center px-6 py-3 border-b border-ivory/10 bg-void/80 mb-1">
              <span className="font-mono text-[10px] text-ivory/50 tracking-[0.2em] uppercase">{activeData.name}</span>
              <button 
                onClick={() => handleCopy(activeData.content, activeTab)}
                className="flex items-center gap-2 hover:text-gold transition-colors text-ivory/40 group/btn"
              >
                {copied === activeTab ? <Check className="w-4 h-4 text-gold" /> : <Copy className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />}
                <span className="font-mono text-[9px] uppercase tracking-widest">{copied === activeTab ? "Copied" : "Copy"}</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-[#020202] custom-scrollbar relative">
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50 crt-scanlines" />
              <AnimatePresence mode="wait">
                <motion.pre 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-[11px] sm:text-xs leading-[1.7] text-ivory/80 break-all whitespace-pre-wrap selection:bg-gold selection:text-void z-10 relative outline-none"
                >
                  <code className="relative z-10 block drop-shadow-md">
                    {activeData.content.split('\n').map((line, i) => {
                      if (line.includes('/*') || line.includes('<!--')) {
                        return <span key={i} className="text-ivory/30">{line}</span>;
                      }
                      return <div key={i}>{line}</div>;
                    })}
                  </code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>

          {/* Shopify Interactive Preview */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center gap-3 font-mono text-[10px] text-ivory/40 tracking-[0.3em] uppercase w-full">
              <span className="shrink-0 w-8 h-[1px] bg-ivory/20" />
              <span>Live Synthetic Preview</span>
            </div>
            
            <p className="font-sans text-sm text-ivory/60 font-light leading-relaxed mb-4 w-full">
              A precise representation of the injected CSS styling on standard Shopify Dawn theme product modules. Notice the immediate tonal shift.
            </p>

            <div className="flex flex-col gap-8 w-full max-w-[400px]">
              {[ 
                { name: "Columbia Soft Shell Jacket", price: "$120.00", img: "/unisex-columbia-soft-shell-jacket-black-front-6a16eba5ad2c4.jpg" },
                { name: "Organic Crafter T-Shirt", price: "$45.00", img: "/unisex-organic-mid-light-crafter-t-shirt-black-left-6a16dd454db32.jpg" },
              ].map((product, i) => (
                <div key={i} className="w-full border border-ivory/5 bg-void p-6 relative group transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(220,197,123,0.15)] hover:-translate-y-1">
                  <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none z-0" />
                  
                  <div className="relative z-10 w-full aspect-square bg-[#0a0a0a] border border-ivory/5 mb-6 flex items-center justify-center overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-1000 ease-out" 
                      style={{ backgroundImage: `url('${product.img}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent opacity-80" />
                    <span className="font-mono text-xs text-ivory/30 tracking-widest uppercase relative z-10">[ Sovereign Provision ]</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <h3 className="font-serif text-2xl text-ivory font-light italic mb-2 drop-shadow-md">
                      {product.name}
                    </h3>
                    <div className="font-mono text-gold tracking-widest text-sm mb-8 drop-shadow-[0_0_10px_rgba(220,197,123,0.3)]">
                      {product.price}
                    </div>

                    <button className="w-full py-4 border border-gold/30 bg-transparent text-ivory uppercase tracking-[0.25em] font-mono text-xs relative overflow-hidden group/add transition-all duration-500 hover:bg-oxblood/15 hover:border-oxblood hover:text-gold hover:shadow-[reset_0_0_25px_rgba(147,0,10,0.5),0_0_15px_rgba(147,0,10,0.3)] active:scale-95">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMjIyMiIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwMCIvPjwvc3ZnPg==')] opacity-0 group-hover/add:opacity-20 pointer-events-none" />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <ShoppingCart className="w-4 h-4 opacity-50 group-hover/add:opacity-100" />
                        Inaugurate Purchase
                      </span>
                    </button>
                  </div>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-ivory/10 pointer-events-none group-hover:border-gold/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-ivory/10 pointer-events-none group-hover:border-gold/50 transition-colors duration-500" />
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
});
