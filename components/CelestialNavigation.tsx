"use client";

import React, { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Terminal,
  Settings2,
  Workflow,
  Cpu,
  RefreshCw,
  Box,
  Layers,
  Database
} from "lucide-react";

// --- CORE SYSTEM DATA ---

const CONSTELLATIONS = [
  {
    id: "avarice-core",
    name: "The Scepter of Avarice",
    sector: "Gold Core Node",
    x: 180,
    y: 80,
    config: {
      density: 1.2,
      typography: "editorial",
      cardStyle: "bordered",
      accentPrimary: "#dcc57b",
      accentBg: "#050505",
    },
    description:
      "High-contrast editorial foundation. Utilizes heavy serif typography, wide margins, and bordered card modules for a rigid, structural luxury state.",
  },
  {
    id: "oxblood-eclipse",
    name: "Oxblood Eclipse",
    sector: "Crimson Abyss",
    x: 90,
    y: 220,
    config: {
      density: 0.85,
      typography: "modern",
      cardStyle: "minimal",
      accentPrimary: "#93000a",
      accentBg: "#030000",
    },
    description:
      "Minimalist, low-density layout optimized for dark-matter negative space. typography is grotesk-focused for brutal architectural tension.",
  },
  {
    id: "platinum-spire",
    name: "Platinum Spire",
    sector: "Prism Vector",
    x: 250,
    y: 150,
    config: {
      density: 1.0,
      typography: "technical",
      cardStyle: "lift",
      accentPrimary: "#ffffff",
      accentBg: "#0a0a0a",
    },
    description:
      "Monospace-heavy, precision-engineered wireframe state. Hover interactions leverage z-axis elevation instead of border reveals.",
  },
];

interface ThemeConfig {
  density: number;
  typography: string;
  cardStyle: string;
  accentPrimary: string;
  accentBg: string;
}

// --- MAIN COMPONENT ---

export function CelestialNavigation() {
  const [activeNodeId, setActiveNodeId] = useState<string>("avarice-core");
  const [isCompiling, setIsCompiling] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const activeNode = CONSTELLATIONS.find((n) => n.id === activeNodeId)!;
  const config = activeNode.config;

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString().split("T")[1].slice(0, -1)}] ${msg}`]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [logs]);

  // --- SHOPIFY THEME GENERATION ENGINE ---

  const compileShopifyTheme = async () => {
    setIsCompiling(true);
    setLogs([]);
    addLog(`INITIATING SHOPIFY ARCHITECTURE COMPILATION...`);
    addLog(`TARGET NODE: ${activeNode.name.toUpperCase()}`);

    try {
      const zip = new JSZip();

      // 1. CONFIG
      addLog("Generating settings_schema.json...");
      
      const fontStack =
        config.typography === "editorial"
          ? '"Newsreader", "Playfair Display", serif'
          : config.typography === "technical"
          ? '"JetBrains Mono", monospace'
          : '"Inter", sans-serif';

      const settingsSchema = [
        {
          name: "Theme Information",
          theme_name: "Sovereign Engine",
          theme_version: "3.0.0",
          theme_author: "Divine_Astrolabe_Initiative",
          theme_documentation_url: "https://example.com/docs",
        },
        {
          name: "Global Aesthetics",
          settings: [
            { type: "color", id: "bg_color", label: "Background Void", default: config.accentBg },
            { type: "color", id: "text_color", label: "Primary Matter", default: "#e6e6e6" },
            { type: "color", id: "accent_color", label: "Core Energy Accent", default: config.accentPrimary },
            { type: "color", id: "border_color", label: "Structural Lines", default: "rgba(255,255,255,0.1)" },
          ],
        },
        {
          name: "Architecture Options",
          settings: [
            { type: "range", id: "spacing_scale", label: "Spacing Scale", min: 0.5, max: 2.0, step: 0.1, default: config.density },
            { type: "select", id: "card_style", label: "Card Module Style", options: [{value:"minimal", label:"Minimal"}, {value:"bordered", label:"Bordered"}, {value:"lift", label:"Z-Axis Lift"}], default: config.cardStyle },
          ],
        },
      ];

      const settingsData = {
        current: "Default",
        presets: {
          Default: {
            bg_color: config.accentBg,
            text_color: "#e6e6e6",
            accent_color: config.accentPrimary,
            border_color: "rgba(255,255,255,0.1)",
            spacing_scale: config.density,
            card_style: config.cardStyle,
          },
        },
      };

      zip.file("config/settings_schema.json", JSON.stringify(settingsSchema, null, 2));
      zip.file("config/settings_data.json", JSON.stringify(settingsData, null, 2));

      // 2. LAYOUT
      addLog("Constructing liquid framework layout/theme.liquid...");
      const layoutTheme = `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="{{ settings.bg_color }}">
    <link rel="canonical" href="{{ canonical_url }}">
    
    <title>
      {{ page_title }}{% if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif %}
      {% if current_page != 1 %} &ndash; Page {{ current_page }}{% endif %}
      {% unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless %}
    </title>

    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {{ content_for_header }}

    {% render 'css-variables' %}
    {{ 'base.css' | asset_url | stylesheet_tag }}
    <script src="{{ 'global.js' | asset_url }}" defer="defer"></script>
    
    <style>
      :root {
        --font-primary: ${fontStack};
      }
    </style>
  </head>
  <body class="template-{{ template.name }}">
    <a class="skip-to-content-link visually-hidden" href="#MainContent">Skip to content</a>
    {% sections 'header-group' %}
    <main id="MainContent" class="main-content" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>
    {% sections 'footer-group' %}
  </body>
</html>`;
      zip.file("layout/theme.liquid", layoutTheme);

      // 3. SNIPPETS
      addLog("Injecting semantic liquid snippets...");
      zip.file(
        "snippets/css-variables.liquid",
        `{% style %}
  :root {
    --color-bg: {{ settings.bg_color }};
    --color-text: {{ settings.text_color }};
    --color-accent: {{ settings.accent_color }};
    --color-border: {{ settings.border_color }};
    --spacing-base: {{ settings.spacing_scale | times: 1.0 }}rem;
    --transition-timing: cubic-bezier(0.16, 1, 0.3, 1);
  }
{% endstyle %}`
      );

      zip.file(
        "snippets/product-card.liquid",
        `{% comment %}
  Renders a product card
  Accepts:
  - product_card_product: {Object} Product Liquid object (optional)
{% endcomment %}
<div class="product-card card-style-{{ settings.card_style }}">
  <a href="{{ product_card_product.url | default: '#' }}" class="product-card__link">
    <div class="product-card__image-wrapper">
      {% if product_card_product.featured_media != blank %}
        <img srcset="{{ product_card_product.featured_media | image_url: width: 400 }} 400w, {{ product_card_product.featured_media | image_url: width: 800 }} 800w"
             sizes="(min-width: 900px) 33vw, (min-width: 500px) 50vw, 100vw"
             src="{{ product_card_product.featured_media | image_url: width: 400 }}"
             alt="{{ product_card_product.featured_media.alt | escape }}"
             loading="lazy"
             class="product-card__image">
      {% else %}
        {{ 'product-1' | placeholder_svg_tag: 'placeholder-svg' }}
      {% endif %}
    </div>
    <div class="product-card__info">
      <h3 class="product-card__title">{{ product_card_product.title | default: 'Sovereign Test Subject' }}</h3>
      <div class="product-card__price">
        {% render 'price', product: product_card_product %}
      </div>
    </div>
  </a>
</div>`
      );

      zip.file(
        "snippets/price.liquid",
        `{%- assign target = product -%}
<div class="price">
  <span class="price__regular">{{ target.price | money }}</span>
</div>`
      );

      // 4. CSS / JS
      addLog("Compiling native CSS utilities and JS controllers...");
      zip.file(
        "assets/base.css",
        `/* SYSTEM ARCHITECTURE : CORE */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 62.5%; }
body { 
  font-size: 1.6rem; 
  font-family: var(--font-primary); 
  background-color: var(--color-bg); 
  color: var(--color-text); 
  line-height: 1.5; 
  -webkit-font-smoothing: antialiased; 
}
a { text-decoration: none; color: inherit; }
ul { list-style: none; }
.visually-hidden { position: absolute !important; overflow: hidden; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0; clip: rect(0 0 0 0); word-wrap: normal !important; }

/* LAYOUT GRIDS */
.container { max-width: 1440px; margin: 0 auto; padding: 0 calc(var(--spacing-base) * 2); }
.grid { display: grid; gap: calc(var(--spacing-base) * 2); }
.grid--3-col { grid-template-columns: repeat(1, 1fr); }
@media(min-width: 768px) { .grid--3-col { grid-template-columns: repeat(3, 1fr); } }

/* BUTTONS */
.btn { 
  display: inline-flex; justify-content: center; align-items: center; 
  padding: calc(var(--spacing-base) * 1.5) calc(var(--spacing-base) * 3); 
  border: 1px solid var(--color-border);
  background: transparent; color: var(--color-text);
  font-family: var(--font-primary); font-size: 1.2rem; letter-spacing: 0.1em;
  text-transform: uppercase; cursor: pointer;
  transition: all 0.4s var(--transition-timing);
}
.btn:hover { border-color: var(--color-accent); color: var(--color-accent); }

/* PRODUCT CARD LOGIC */
.product-card { position: relative; display: flex; flex-direction: column; overflow: hidden; background: transparent; transition: all 0.4s var(--transition-timing); }
.card-style-bordered { border: 1px solid var(--color-border); padding: calc(var(--spacing-base) * 1); }
.card-style-minimal { border: none; padding: 0; }
.card-style-lift { border: 1px solid transparent; }
.card-style-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-color: var(--color-border); }
.product-card__image-wrapper { position: relative; width: 100%; padding-bottom: 120%; background: rgba(255,255,255,0.03); overflow: hidden; }
.product-card__image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s var(--transition-timing); }
.product-card:hover .product-card__image { transform: scale(1.03); }
.placeholder-svg { width: 100%; height: 100%; position: absolute; top: 0; left: 0; fill: rgba(255,255,255,0.1); }
.product-card__info { padding-top: calc(var(--spacing-base) * 1.5); display: flex; justify-content: space-between; align-items: flex-start; }
.product-card__title { font-size: 1.4rem; font-weight: normal; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
.price { font-family: monospace; font-size: 1.2rem; color: var(--color-accent); }

/* HERO SECTION */
.hero { position: relative; width: 100%; min-height: 90vh; display: flex; align-items: center; justify-content: flex-start; overflow: hidden; border-bottom: 1px solid var(--color-border); }
.hero__bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.4; pointer-events: none; }
.hero__content { position: relative; z-index: 10; padding: 0 calc(var(--spacing-base) * 4); max-width: 1000px; }
.hero__sub { display: block; font-family: monospace; letter-spacing: 0.2em; color: var(--color-accent); margin-bottom: calc(var(--spacing-base) * 2); text-transform: uppercase; font-size: 1.1rem; }
.hero__title { font-size: clamp(4rem, 8vw, 10rem); line-height: 1; margin-bottom: calc(var(--spacing-base) * 2); font-weight: 300; text-transform: uppercase; letter-spacing: -0.02em; }
.hero__text { font-size: 1.8rem; opacity: 0.7; max-width: 600px; margin-bottom: calc(var(--spacing-base) * 4); }

/* HEADER */
.header { position: sticky; top: 0; z-index: 250; width: 100%; background: var(--color-bg); border-bottom: 1px solid var(--color-border); padding: calc(var(--spacing-base)*1.5) 0; }
.header__inner { display: flex; justify-content: space-between; align-items: center; }
.header__logo { font-size: 2rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-accent); font-weight: bold; }
.header__nav { display: flex; gap: calc(var(--spacing-base)*2); }
.header__nav a { font-family: monospace; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.1em; transition: color 0.3s; }
.header__nav a:hover { color: var(--color-accent); }`
      );

      zip.file(
        "assets/global.js",
        `class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
  }
  onVariantChange() {
    // Structural stub for variant changes. Implements clean vanilla architecture.
    console.log('[SOVEREIGN ENGINE] Variant shift detected');
  }
}
customElements.define('variant-selects', VariantSelects);

// Global intersection observer for fade-in reveals
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Future proofing element reveals
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
});`
      );

      // 5. SECTIONS
      addLog("Generating dynamic Shopify Liquid sections...");
      zip.file(
        "sections/header.liquid",
        `<header class="header">
  <div class="container header__inner">
    <a href="{{ routes.root_url }}" class="header__logo">{{ shop.name }}</a>
    <nav class="header__nav">
      {% for link in linklists[section.settings.menu].links %}
        <a href="{{ link.url }}">{{ link.title }}</a>
      {% endfor %}
    </nav>
    <a href="{{ routes.cart_url }}" class="header__nav-cart">Cart ({%- if cart.item_count < 10 -%}0{%- endif -%}{{ cart.item_count }})</a>
  </div>
</header>
{% schema %}
{
  "name": "Header",
  "settings": [
    {
      "type": "link_list",
      "id": "menu",
      "default": "main-menu",
      "label": "Menu"
    }
  ]
}
{% endschema %}`
      );

      zip.file(
        "sections/footer.liquid",
        `<footer style="padding: calc(var(--spacing-base)*6) 0; border-top: 1px solid var(--color-border); margin-top: calc(var(--spacing-base)*8);">
  <div class="container">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <h2 style="margin-bottom:1rem; font-family:monospace; color:var(--color-accent); font-size:1.2rem; text-transform:uppercase;">{{ shop.name }}</h2>
        <p style="opacity:0.6; max-width:300px;">Architectural manifestation initialized via the God-Tier Astrolabe Engine.</p>
      </div>
      <div style="display:flex; gap:4rem;">
        {% for block in section.blocks %}
          {% if block.type == 'link_list' %}
            <div>
              <h3 style="font-family:monospace; margin-bottom:1.5rem; font-size:1.1rem; text-transform:uppercase;">{{ block.settings.heading }}</h3>
              <ul style="opacity:0.7; display:flex; flex-direction:column; gap:0.8rem; font-size:1.3rem;">
                {% for link in linklists[block.settings.menu].links %}
                  <li><a href="{{ link.url }}">{{ link.title }}</a></li>
                {% endfor %}
              </ul>
            </div>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  </div>
</footer>
{% schema %}
{
  "name": "Footer",
  "blocks": [
    {
      "type": "link_list",
      "name": "Menu",
      "settings": [
        { "type": "text", "id": "heading", "label": "Heading", "default": "Quick links" },
        { "type": "link_list", "id": "menu", "label": "Menu" }
      ]
    }
  ]
}
{% endschema %}`
      );

      zip.file(
        "sections/image-with-text-hero.liquid",
        `<section class="hero">
  {% if section.settings.image != blank %}
    {{ section.settings.image | image_url: width: 2000 | image_tag: class: 'hero__bg', loading: 'eager' }}
  {% else %}
    <div class="hero__bg" style="background: linear-gradient(45deg, #000, #111);"></div>
  {% endif %}
  <div class="container">
    <div class="hero__content">
      {% if section.settings.subheading != blank %}
        <span class="hero__sub">{{ section.settings.subheading | escape }}</span>
      {% endif %}
      {% if section.settings.title != blank %}
        <h1 class="hero__title">{{ section.settings.title | escape }}</h1>
      {% endif %}
      {% if section.settings.text != blank %}
        <p class="hero__text">{{ section.settings.text | escape }}</p>
      {% endif %}
      {% if section.settings.btn_link != blank and section.settings.btn_label != blank %}
        <a href="{{ section.settings.btn_link }}" class="btn">{{ section.settings.btn_label | escape }}</a>
      {% endif %}
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Architectural Hero",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Background Image" },
    { "type": "text", "id": "subheading", "label": "Subheading", "default": "SYSTEM NODE ACTIVE" },
    { "type": "text", "id": "title", "label": "Heading", "default": "Absolute Zero Void" },
    { "type": "textarea", "id": "text", "label": "Text", "default": "Establishing secure connections to deep space commerce grids." },
    { "type": "text", "id": "btn_label", "label": "Button Label", "default": "INITIALIZE" },
    { "type": "url", "id": "btn_link", "label": "Button Link" }
  ],
  "presets": [{ "name": "Architectural Hero" }]
}
{% endschema %}`
      );

      zip.file(
        "sections/featured-collection.liquid",
        `<section style="padding: calc(var(--spacing-base)*6) 0;">
  <div class="container">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom: 1px solid var(--color-border); padding-bottom: calc(var(--spacing-base)*2); margin-bottom: calc(var(--spacing-base)*4);">
      <h2 style="font-size:3rem; font-weight:300; text-transform:uppercase;">{{ section.settings.title | escape }}</h2>
      <a href="{{ collections[section.settings.collection].url }}" style="font-family:monospace; text-transform:uppercase; font-size:1.1rem; color:var(--color-accent);">View All Vault</a>
    </div>
    <div class="grid grid--3-col">
      {% for product in collections[section.settings.collection].products limit: section.settings.product_limit %}
        {% render 'product-card', product_card_product: product %}
      {% else %}
        {% for i in (1..section.settings.product_limit) %}
          {% render 'product-card' %}
        {% endfor %}
      {% endfor %}
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Modular Product Grid",
  "settings": [
    { "type": "text", "id": "title", "label": "Heading", "default": "Classified Artifacts" },
    { "type": "collection", "id": "collection", "label": "Collection" },
    { "type": "range", "id": "product_limit", "label": "Maximum products to show", "min": 3, "max": 12, "step": 3, "default": 3 }
  ],
  "presets": [{ "name": "Modular Product Grid" }]
}
{% endschema %}`
      );

      // JSON TEMPLATES
      addLog("Constructing rigid JSON template structures...");
      zip.file(
        "templates/index.json",
        JSON.stringify({
          sections: {
            hero: {
              type: "image-with-text-hero",
              settings: {
                title: activeNode.name,
                subheading: `COORDINATES // LAT ${config.density} SCALE // ${activeNode.sector.toUpperCase()}`,
                text: activeNode.description,
                btn_label: "ACCESS DATABASE",
                btn_link: "shopify://collections/all"
              }
            },
            featured: {
              type: "featured-collection",
              settings: {
                title: "Manifested Assets",
                product_limit: 3
              }
            }
          },
          order: ["hero", "featured"]
        }, null, 2)
      );

      // We group header and footer in JSON (Shopify OS 2.0 standard)
      zip.file(
        "sections/header-group.json",
        JSON.stringify({
          type: "header",
          name: "Header setup",
          sections: {
            main: { type: "header", settings: { menu: "main-menu" } }
          },
          order: ["main"]
        }, null, 2)
      );

      zip.file(
        "sections/footer-group.json",
        JSON.stringify({
          type: "footer",
          name: "Footer setup",
          sections: {
            main: {
              type: "footer",
              blocks: {
                link_list_1: { type: "link_list", settings: { heading: "Databases", menu: "main-menu" } },
                link_list_2: { type: "link_list", settings: { heading: "Systems", menu: "footer" } }
              },
              block_order: ["link_list_1", "link_list_2"],
              settings: {}
            }
          },
          order: ["main"]
        }, null, 2)
      );

      addLog("Finalizing Archive Compression...");

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Sovereign_Engine_-_${activeNode.id}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addLog("SUCCESS: Shopify Theme Package exported.");

    } catch (err) {
      console.error(err);
      addLog("ERROR: Engine failure during compilation.");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans flex flex-col font-light selection:bg-white selection:text-black">
      
      {/* HEADER */}
      <header className="h-[60px] border-b border-[#222] flex items-center justify-between px-6 shrink-0 bg-[#020202]">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 border border-[#ededed] flex items-center justify-center relative">
            <div className="w-1 h-1 bg-[#ededed] animate-pulse" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#ededed] translate-x-1 -translate-y-1" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#ededed] -translate-x-1 translate-y-1" />
          </div>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#888]">
            Divine_Astrolabe <span className="text-[#ededed]">v3.0.0</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-[#666]">
            <ServerStatus active={true} />
            NODE ALIGNED
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT GRID */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT PANEL / CONTROLS */}
        <aside className="w-full md:w-[380px] shrink-0 border-r border-[#222] bg-[#080808] flex flex-col">
          <div className="p-6 border-b border-[#222]">
            <h2 className="font-mono text-[10px] text-[#888] tracking-widest uppercase mb-6 flex items-center gap-2">
              <Workflow className="w-3 h-3" /> Target Astrolabe Vectors
            </h2>
            
            <div className="space-y-2">
              {CONSTELLATIONS.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeId(node.id)}
                  className={`w-full text-left p-4 border transition-all duration-300 relative group flex flex-col gap-2 ${
                    activeNodeId === node.id 
                      ? "bg-[#111] border-[#444] shadow-[0_0_20px_rgba(255,255,255,0.02)]" 
                      : "bg-transparent border-transparent hover:border-[#222] hover:bg-[#0a0a0a]"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`font-mono text-[11px] tracking-wider uppercase transition-colors ${activeNodeId === node.id ? "text-white" : "text-[#777]"}`}>
                      {node.name}
                    </span>
                    {activeNodeId === node.id && (
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: node.config.accentPrimary }} />
                    )}
                  </div>
                  <span className="font-sans text-[11px] text-[#555] tracking-wide">
                    {node.sector}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <h2 className="font-mono text-[10px] text-[#888] tracking-widest uppercase mb-6 flex items-center gap-2">
              <Settings2 className="w-3 h-3" /> Extrapolated Config
            </h2>
            
            <div className="space-y-6">
              <ConfigRow label="Density / Padding Scale" value={config.density.toFixed(2) + "x"} />
              <ConfigRow label="Typography Engine" value={config.typography.toUpperCase()} />
              <ConfigRow label="Product Card Render" value={config.cardStyle.toUpperCase()} />
              
              <div className="pt-4 border-t border-[#222]">
                <span className="block font-mono text-[9px] text-[#666] mb-3 uppercase tracking-widest">Aesthetic Preview</span>
                <p className="text-[13px] leading-relaxed text-[#999] font-light">
                  {activeNode.description}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER VISUALIZER */}
        <main className="flex-1 relative flex flex-col bg-[#030303] overflow-hidden">
          
          {/* SVG Grid Background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Interactive Radar/Astrolabe Map */}
          <div className="flex-1 flex items-center justify-center relative z-10 p-8">
            <div className="relative w-full max-w-[500px] aspect-square rounded-full flex items-center justify-center">
              
              {/* Outer Rings */}
              <div className="absolute inset-0 border border-[#222] rounded-full" />
              <div className="absolute inset-4 border border-[#1a1a1a] rounded-full border-dashed" />
              <div className="absolute inset-16 border border-[#222] rounded-full" />
              
              {/* Crosshairs */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#111]" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-[#111]" />

              {/* Node Rendering */}
              {CONSTELLATIONS.map((node) => {
                const isActive = activeNodeId === node.id;
                return (
                  <motion.div
                    key={node.id}
                    className="absolute w-6 h-6 -ml-3 -mt-3 cursor-pointer group flex items-center justify-center z-20"
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    onClick={() => setActiveNodeId(node.id)}
                    animate={{ scale: isActive ? 1 : 0.8 }}
                  >
                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'w-3 h-3' : ''}`} style={{ background: isActive ? node.config.accentPrimary : '#555' }} />
                    
                    {/* Ring highlight */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 2.5, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute inset-0 border rounded-full pointer-events-none"
                          style={{ borderColor: node.config.accentPrimary, opacity: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Tooltip Label */}
                    <div className="absolute top-full mt-2 w-max text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono text-[9px] tracking-widest text-[#888] uppercase">
                      {node.name}
                    </div>
                  </motion.div>
                );
              })}

              {/* Active Radar Line connecting center to active node */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line 
                  x1="50%" 
                  y1="50%" 
                  x2={activeNode.x} 
                  y2={activeNode.y} 
                  stroke={activeNode.config.accentPrimary} 
                  strokeWidth="1" 
                  strokeOpacity="0.3" 
                  strokeDasharray="4 4" 
                />
              </svg>
            </div>
            
            {/* Corner Decorative Data */}
            <div className="absolute top-8 left-8 flex flex-col gap-1 font-mono text-[9px] text-[#444] uppercase tracking-widest pointer-events-none">
              <span>SYS_MONITOR // ACTIVE</span>
              <span>GRID_MAP // C_04X</span>
            </div>
            <div className="absolute bottom-8 right-8 flex flex-col gap-1 font-mono text-[9px] text-[#444] uppercase tracking-widest text-right pointer-events-none">
              <span>{activeNode.name}</span>
              <span>LOCKED X:{activeNode.x} Y:{activeNode.y}</span>
            </div>
          </div>

        </main>
        
        {/* RIGHT PANEL / EXPORT ENGINE */}
        <aside className="w-full md:w-[420px] shrink-0 border-l border-[#222] bg-[#080808] flex flex-col">
          
          <div className="p-6 border-b border-[#222]">
            <h3 className="font-mono text-[12px] tracking-[0.2em] text-white uppercase mb-2">Shopify Framework Injector</h3>
            <p className="text-[12px] text-[#666] leading-relaxed font-sans mb-8">
              Compiles the raw node settings into an OS 2.0 compatible Shopify theme. Includes schema generation, liquid structure, and base CSS architecture.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#111] p-4 text-center border border-[#1a1a1a]">
                <Box className="w-4 h-4 text-[#888] mx-auto mb-2" />
                <span className="block font-mono text-[9px] text-[#555] uppercase tracking-widest mb-1">Templates</span>
                <span className="font-mono text-[12px] text-[#ccc]">3 Pages</span>
              </div>
              <div className="bg-[#111] p-4 text-center border border-[#1a1a1a]">
                <Layers className="w-4 h-4 text-[#888] mx-auto mb-2" />
                <span className="block font-mono text-[9px] text-[#555] uppercase tracking-widest mb-1">Sections</span>
                <span className="font-mono text-[12px] text-[#ccc]">4 Core</span>
              </div>
            </div>

            <button
              onClick={compileShopifyTheme}
              disabled={isCompiling}
              className={`w-full flex items-center justify-center gap-3 py-4 text-[11px] font-mono tracking-[0.2em] uppercase transition-all ${
                isCompiling 
                  ? "bg-[#111] text-[#666] border border-[#222] cursor-not-allowed"
                  : "bg-[#ededed] text-black hover:bg-white cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              }`}
            >
              {isCompiling ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Compiling...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export Theme Archive
                </>
              )}
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col bg-[#040404]">
            <h4 className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-4 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Compiler Output Log
            </h4>
            <div 
              ref={logsEndRef}
              className="flex-1 bg-[#020202] border border-[#111] rounded p-4 font-mono text-[10px] text-[#666] leading-relaxed overflow-y-auto"
            >
              <div className="flex flex-col gap-1.5">
                {logs.length === 0 ? (
                  <span className="opacity-50">System awaiting export command...</span>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={`${log.includes('SUCCESS') ? 'text-green-500/80' : log.includes('ERROR') ? 'text-red-500/80' : 'text-[#888]'}`}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const ServerStatus = ({ active }: { active: boolean }) => (
  <div className="relative flex items-center justify-center w-2 h-2 mr-1">
    {active && <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green-500/40"></span>}
    <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${active ? 'bg-green-500/80' : 'bg-red-500/80'}`}></span>
  </div>
);

const ConfigRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="font-mono text-[9px] text-[#555] uppercase tracking-widest">{label}</span>
    <span className="font-mono text-[12px] text-[#ccc] border-l-2 border-[#222] pl-3 py-0.5">{value}</span>
  </div>
);
