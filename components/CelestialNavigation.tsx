"use client";

import { useState, useEffect, useRef } from "react";
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
  Compass,
  Download
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

interface HistoryItem {
  id: string;
  constellation: string;
  latitude: number;
  ascension: number;
  prophecy: string;
  timestamp: string;
}

const CONSTELLATIONS_INFO = [
  {
    name: "The Scepter of Avarice",
    sector: "Gold Core Node",
    ideal: "LAT 45° // ASC 12.0h",
    desc: "The primary coordinate of absolute authority. Aligned with gold fire cascades.",
    tier: "Sovereign Tier I",
    threat: "Sovereign Gold",
    lore: "Forged in the initial compression of the primary singularity. It serves as the cosmic balance weight against which all void-level gold reserves are verified.",
  },
  {
    name: "Oxblood Eclipse",
    sector: "Crimson Abyss",
    ideal: "LAT -90° // ASC 3.3h",
    desc: "A menacing star cluster shrouded in deep burgundy velvet and abyssal friction.",
    tier: "Forbidden Class IV",
    threat: "Friction Crimson",
    lore: "A gravitational collapse vector drawing upon pure dark-energy matter pools. It designates the ancient stellar sector of the Great Severance.",
  },
  {
    name: "Platinum Spire",
    sector: "Prism Vector",
    ideal: "LAT 0° // ASC 0.0h",
    desc: "Pristine alignment vector. Emits an uncorrupted platinum stellar current.",
    tier: "First Manifest VII",
    threat: "Absolute Platinum",
    lore: "The singular uncorrupted lighthouse in the central void space. Synchronizing with this node purges adjacent system interference.",
  },
  {
    name: "The Silent Lion",
    sector: "Velvet Vault Sector",
    ideal: "LAT 110° // ASC 18.5h",
    desc: "An ancient structural anchor. Quiet, secure, guarding deep dimensional secrets.",
    tier: "Primordial Arch VI",
    threat: "Stasis White",
    lore: "Dormant for five eons, this infinite-density mass remains perfectly locked within the black marble layout of the central armory.",
  },
  {
    name: "Obsidian Helix",
    sector: "Black Spiral Matrix",
    ideal: "LAT -33° // ASC 8.8h",
    desc: "A massive gravity well inside the black marble layout of the multiverse.",
    tier: "Eschaton Well IX",
    threat: "Avenge Black",
    lore: "A helical geometry tearing through spatial dimensions. Any matter entering the Helix is instantly recompiled into premium raw attributes.",
  },
];

const NODE_COORDINATES: Record<string, { x: string; y: string; offset: string }> = {
  "The Scepter of Avarice": { x: "65%", y: "35%", offset: "translate-x-4 -translate-y-1/2" },
  "Oxblood Eclipse": { x: "50%", y: "80%", offset: "-translate-x-1/2 translate-y-4" },
  "Platinum Spire": { x: "50%", y: "26.6%", offset: "-translate-x-1/2 -translate-y-[calc(100%+16px)]" },
  "The Silent Lion": { x: "86.6%", y: "60%", offset: "translate-x-4 -translate-y-1/2" },
  "Obsidian Helix": { x: "30%", y: "61%", offset: "-translate-x-[calc(150%+16px)] -translate-y-1/2" },
};


export function CelestialNavigation() {
  const [selectedConst, setSelectedConst] = useState("The Scepter of Avarice");
  const [hoveredConst, setHoveredConst] = useState<string | null>(null);
  const [latitude, setLatitude] = useState(45.0);
  const [ascension, setAscension] = useState(12.0);
  const [isPlotting, setIsPlotting] = useState(false);
  const [result, setResult] = useState<NavigationResult | null>(null);
  const [hasPlotted, setHasPlotted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load alignment history trace logs from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("avarice_nav_history");
      if (saved) {
        try {
          setTimeout(() => {
            setHistory(JSON.parse(saved));
          }, 0);
        } catch (err) {
          console.error("Failed parsing historical trace logs:", err);
        }
      }
    }
  }, []);

  // Subtle slow-moving ambient star-field rendering loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const resize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    const count = 45;
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      pulse: number;
      vx: number;
      vy: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.3 + 0.3,
        opacity: Math.random() * 0.7 + 0.1,
        pulse: Math.random() * 0.015 + 0.003,
        vx: (Math.random() - 0.5) * 0.08,
        vy: Math.random() * 0.12 + 0.04, // Descent direction
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.y > h) {
          star.y = 0;
          star.x = Math.random() * w;
        }
        if (star.x < 0 || star.x > w) {
          star.vx = -star.vx;
        }

        // Breathing twinkle brightness pulse
        star.opacity += star.pulse;
        if (star.opacity > 0.9 || star.opacity < 0.1) {
          star.pulse = -star.pulse;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 198, 197, ${Math.max(0, star.opacity)})`;
        ctx.fill();

        if (star.radius > 1.0) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 197, 123, ${Math.max(0, star.opacity * 0.25)})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Parchment PDF Generator matching premium Divine Archive aesthetics
  const handlePdfExport = async () => {
    setIsExportingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // 1. Draw Void Dark Layout Background
      doc.setFillColor(5, 5, 5);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // 2. Draw Subtle Radial Rings (representing astrolabe calibration arcs)
      doc.setDrawColor(147, 0, 10); // Oxblood
      doc.setLineWidth(0.25);
      doc.circle(pageWidth / 2, pageHeight / 2, 75, "S");
      
      doc.setDrawColor(220, 197, 123); // Gold Inside Accent
      doc.setLineWidth(0.12);
      doc.circle(pageWidth / 2, pageHeight / 2, 71, "S");

      // 3. Elegant Outer/Inner Double borders
      doc.setDrawColor(147, 0, 10); // Oxblood Outermost Double Border
      doc.setLineWidth(0.5);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20, "S");

      doc.setDrawColor(220, 197, 123); // Inner Gold Frame
      doc.setLineWidth(0.15);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24, "S");

      // Corner aesthetic frames
      const drawFrames = (bx: number, by: number, bw: number, bh: number) => {
        doc.setDrawColor(220, 197, 123);
        doc.setLineWidth(0.2);
        doc.line(bx, by + 5, bx, by);
        doc.line(bx, by, bx + 5, by);
        doc.line(bx + bw - 5, by, bx + bw, by);
        doc.line(bx + bw, by, bx + bw, by + 5);
        doc.line(bx, by + bh - 5, bx, by + bh);
        doc.line(bx, by + bh, bx + 5, by + bh);
        doc.line(bx + bw - 5, by + bh, bx + bw, by + bh);
        doc.line(bx + bw, by + bh - 5, bx + bw, by + bh);
      };
      drawFrames(14, 14, pageWidth - 28, pageHeight - 28);

      // Title & Editorial headings
      doc.setFont("times", "italic");
      doc.setFontSize(26);
      doc.setTextColor(220, 197, 123); // Muted gold
      doc.text("The Verse", pageWidth / 2, 34, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(201, 198, 197); // Platinum text
      doc.text("DIVINE ARCHIVE // ORACLE SECTOR CHRONICLES", pageWidth / 2, 40, { align: "center" });

      // Dividing gold/crimson hairline separator
      doc.setDrawColor(147, 0, 10);
      doc.setLineWidth(0.4);
      doc.line(32, 46, pageWidth - 32, 46);

      // Assemble dataset rows
      const activeConst = result ? result.constellation : selectedConst;
      const activeLat = result ? result.latitude : latitude;
      const activeAsc = result ? result.ascension : ascension;
      const activeCycles = result ? result.travelCycles : 3;
      const activeDist = result ? result.distortion : 4.2;
      const activeProphecy = result ? result.prophecy : "In the convergence of scepters lies the eternal verification of the absolute luxury void, a black marble harbor of gold and crimson sparks.";
      const activeStatus = result ? result.statusText : "Synchronization Completed";
      const activeThreat = result ? result.encounterType : "Uncorrupted Core State Guarded";

      doc.setFont("times", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(220, 197, 123);
      doc.text("DIVINE ALIGNMENT DATA LEDGER", 30, 60);

      const tableData = [
        { label: "Sovereign Node Code", val: activeConst.toUpperCase() },
        { label: "Astral Ascension Space", val: `LAT ${activeLat >= 0 ? "+" : ""}${activeLat}° // RA ${activeAsc.toFixed(1)}h` },
        { label: "Cycle Calibrations Limit", val: `${activeCycles} Sols` },
        { label: "Trajectory Noise Factor", val: `${activeDist.toFixed(2)}%` },
        { label: "Oracle Clearance Signal", val: activeStatus.toUpperCase() },
        { label: "Threat Clearance Sector", val: activeThreat.toUpperCase() }
      ];

      let currentY = 70;
      tableData.forEach((row) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(row.label, 30, currentY);

        doc.setFont("courier", "bold");
        doc.setFontSize(9);
        doc.setTextColor(201, 198, 197); // Platinum
        doc.text(row.val, 110, currentY);

        doc.setDrawColor(147, 0, 10);
        doc.setLineWidth(0.1);
        doc.line(30, currentY + 3, pageWidth - 30, currentY + 3);

        currentY += 11;
      });

      // Large Elegant Decree Frame Block
      currentY += 10;
      doc.setFont("times", "italic");
      doc.setFontSize(11);
      doc.setTextColor(220, 197, 123);
      doc.text("THE PROPHETIC DECREE", pageWidth / 2, currentY, { align: "center" });

      currentY += 8;
      doc.setFont("times", "italic");
      doc.setFontSize(12.5);
      doc.setTextColor(201, 198, 197); // Platinum
      
      const wrapText = doc.splitTextToSize(activeProphecy, pageWidth - 60);
      doc.text(wrapText, pageWidth / 2, currentY, { align: "center", lineHeightFactor: 1.45 });

      // Official lower gold stamp
      const sealY = pageHeight - 35;
      doc.setDrawColor(220, 197, 123);
      doc.setLineWidth(0.15);
      doc.circle(pageWidth / 2, sealY, 11, "S");
      
      doc.setFont("times", "italic");
      doc.setFontSize(7);
      doc.setTextColor(220, 197, 123);
      doc.text("KINGSHADP", pageWidth / 2, sealY - 1, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5);
      doc.setTextColor(147, 0, 10);
      doc.text("AVARICE LOCKED", pageWidth / 2, sealY + 3, { align: "center" });

      // Final Solar Metrics
      const dateString = new Date().toISOString().substring(0, 10);
      doc.setFont("courier", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(122, 114, 111);
      doc.text(`SOLAR_TIMESTAMP: ${dateString}`, 30, pageHeight - 15);
      doc.text("AUTHENTICATED_SECURE_BY_AVARICE_LEDGER", pageWidth - 30, pageHeight - 15, { align: "right" });

      doc.save(`kingshadp-prophecy-${activeConst.toLowerCase().replace(/ /g, "-")}.pdf`);
    } catch (err) {
      console.error("Failed building custom parchment PDF document:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleShopifyExport = async () => {
    setIsExporting(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const activeConst = result ? result.constellation : selectedConst;
      const activeLat = result ? result.latitude : latitude;
      const activeAsc = result ? result.ascension : ascension;
      const activeCycles = result ? result.travelCycles : 3;
      const activeDist = result ? result.distortion : 4.2;
      const activeProphecy = result ? result.prophecy : "In the convergence of scepters lies the eternal verification of the absolute luxury void, a black marble harbor of gold and crimson sparks.";

      const layoutThemeLiquid = `<!DOCTYPE html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="{{ canonical_url }}">
  
  <title>{{ page_title }} - Avarice Luxury</title>
  
  {% if page_description %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}

  <!-- Google Fonts: Newsreader (primary serif) & Inter (labels) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&family=Newsreader:ital,opsz,wght@1,6..72,200;1,6..72,400;1,6..72,700&display=swap" rel="stylesheet">

  {{ content_for_header }}
  
  {{ 'theme.css' | asset_url | stylesheet_tag }}
</head>
<body class="bg-void text-platinum min-h-screen relative overflow-x-hidden">
  
  <!-- Custom luxury cursor elements -->
  <div class="luxury-cursor-dot"></div>
  <div class="luxury-cursor-circle"></div>

  <!-- Ambient noise overlay -->
  <div class="luxury-noise-overlay"></div>

  <main id="MainContent" class="focus-none" role="main" tabindex="-1">
    {{ content_for_layout }}
  </main>

  {{ 'theme.js' | asset_url | script_tag }}
</body>
</html>`;

      const settingsSchemaJson = [
        {
          "name": "theme_info",
          "theme_name": "The Verse Avarice Luxury",
          "theme_version": "1.0.0",
          "theme_author": "The Verse team",
          "theme_documentation_url": "https://kingshadp.github.io/the-verse",
          "theme_support_url": "https://kingshadp.github.io/the-verse/support"
        },
        {
          "name": "Design Colors",
          "settings": [
            {
              "type": "color",
              "id": "color_bg",
              "label": "The Void Color",
              "default": "#050505"
            },
            {
              "type": "color",
              "id": "color_primary",
              "label": "Platinum Text",
              "default": "#c9c6c5"
            },
            {
              "type": "color",
              "id": "color_accent",
              "label": "Oxblood Crimson",
              "default": "#93000a"
            },
            {
              "type": "color",
              "id": "color_gold",
              "label": "Muted Gold Accent",
              "default": "#dcc57b"
            }
          ]
        }
      ];

      const settingsDataJson = {
        "current": "Default",
        "presets": {
          "Default": {
            "color_bg": "#050505",
            "color_primary": "#c9c6c5",
            "color_accent": "#93000a",
            "color_gold": "#dcc57b"
          }
        }
      };

      const indexJson = {
        "sections": {
          "hero": {
            "type": "the-verse-hero",
            "settings": {
              "title_top": "THE GOD.",
              "title_bottom": "KINGSHADP",
              "badge": "Origin_Node // Aligned"
            }
          },
          "constellations": {
            "type": "the-verse-constellations",
            "settings": {
              "title": "Aligned Constellations Ledger",
              "constellation": activeConst,
              "latitude": activeLat.toString(),
              "ascension": activeAsc.toString() + "h",
              "cycles": activeCycles.toString(),
              "distortion": activeDist.toFixed(1)
            }
          },
          "manifestations": {
            "type": "the-verse-manifestations",
            "settings": {
              "title_manifests": "Stellar Manifestations"
            }
          },
          "oracle": {
            "type": "the-verse-oracle",
            "settings": {
              "title": "The Oracle's Prophetic Judgment",
              "prophecy_text": activeProphecy
            }
          }
        },
        "order": [
          "hero",
          "constellations",
          "manifestations",
          "oracle"
        ]
      };

      const sectionHeroLiquid = `<div class="verse-hero-section relative min-h-screen flex items-center justify-center overflow-hidden" style="background-color: {{ settings.color_bg }};">
  <!-- Moving cosmic elements -->
  <div class="absolute inset-0 atmosphere z-0 opacity-40"></div>
  <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050505] to-transparent h-1/3 z-10"></div>
  
  <!-- Grid Matrix Overlay with 4 premium structural columns -->
  <div class="absolute inset-0 grid grid-cols-4 max-w-7xl mx-auto pointer-events-none opacity-5 z-10">
    <div class="border-r border-platinum h-full w-full"></div>
    <div class="border-r border-platinum h-full w-full"></div>
    <div class="border-r border-platinum h-full w-full"></div>
    <div class="h-full w-full"></div>
  </div>

  <div class="relative z-20 flex flex-col items-center justify-center text-center px-6">
    <div class="flex items-center gap-6 mb-8 uppercase tracking-[0.6em] text-xs font-mono" style="color: {{ settings.color_gold }};">
      <span class="w-12 h-[1px]" style="background-color: {{ settings.color_gold }}44;"></span>
      <span>{{ section.settings.badge }}</span>
      <span class="w-12 h-[1px]" style="background-color: {{ settings.color_gold }}44;"></span>
    </div>

    <h1 class="font-serif text-7xl md:text-9xl font-light tracking-tighter uppercase leading-none text-platinum mb-4">
      {{ section.settings.title_top }}
    </h1>
    <h1 class="font-serif text-7xl md:text-9xl font-light tracking-tighter uppercase leading-none opacity-60 text-platinum italic">
      {{ section.settings.title_bottom }}
    </h1>

    <p class="mt-12 max-w-xl font-serif text-lg italic text-platinum/60 font-light leading-relaxed">
      {{ section.settings.tagline }}
    </p>
    
    <div class="mt-16">
      <a href="/collections/all" class="verse-ghost-btn font-mono text-[9px] uppercase tracking-[0.4em] py-4 px-10 border border-platinum/25 text-platinum hover:text-white transition-all duration-700">
        Enter the Scepter
      </a>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "The Verse Hero",
  "settings": [
    {
      "type": "text",
      "id": "badge",
      "label": "Badge Text",
      "default": "Origin_Node // Aligned"
    },
    {
      "type": "text",
      "id": "title_top",
      "label": "Heading Part 1",
      "default": "THE GOD."
    },
    {
      "type": "text",
      "id": "title_bottom",
      "label": "Heading Part 2",
      "default": "KINGSHADP"
    },
    {
      "type": "textarea",
      "id": "tagline",
      "label": "Theme Decree Subtitle",
      "default": "Identity re-forged into divine corporate-spiritual mythology. Calculated alignments completed."
    }
  ],
  "presets": [
    {
      "name": "The Verse Hero"
    }
  ]
}
{% endschema %}`;

      const sectionConstellationsLiquid = `<div class="verse-astrolabe-section py-32 px-6 lg:px-12 relative overflow-hidden" style="background-color: {{ settings.color_bg }}; border-top: 1px solid {{ settings.color_accent }}44;">
  <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-stretch relative z-10">
    <div class="flex-1 flex flex-col justify-between border p-12 relative" style="border-color: {{ settings.color_accent }}33; background: rgba(5,5,5,0.85);">
      <!-- Glowing corners -->
      <div class="absolute top-0 left-0 w-3 h-3 border-t border-l" style="border-color: {{ settings.color_accent }};"></div>
      <div class="absolute top-0 right-0 w-3 h-3 border-t border-r" style="border-color: {{ settings.color_accent }};"></div>
      <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style="border-color: {{ settings.color_accent }};"></div>
      <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style="border-color: {{ settings.color_accent }};"></div>

      <div class="space-y-8">
        <span class="font-mono text-[9px] uppercase tracking-[0.5em] block" style="color: {{ settings.color_gold }};">DIVINE_ASTROLABE_MONITOR //</span>
        <h2 class="font-serif text-4xl text-platinum tracking-tight uppercase leading-none">{{ section.settings.title }}</h2>
        <p class="font-serif italic text-base text-platinum/50 leading-relaxed">{{ section.settings.description }}</p>
        
        <div class="h-px w-full" style="background-color: {{ settings.color_accent }}33;"></div>
        
        <div class="space-y-4">
          <div class="flex justify-between font-mono text-[10px] tracking-widest text-[#c9c6c5] uppercase">
            <span>Aligned Sovereign Cluster</span>
            <span style="color: {{ settings.color_gold }};">{{ section.settings.constellation }}</span>
          </div>
          <div class="flex justify-between font-mono text-[10px] tracking-widest text-[#c9c6c5] uppercase">
            <span>Void Coordinates</span>
            <span>LAT {{ section.settings.latitude }}° / RA {{ section.settings.ascension }}</span>
          </div>
          <div class="flex justify-between font-mono text-[10px] tracking-widest text-[#c9c6c5] uppercase">
            <span>Cycles Traversing</span>
            <span style="color: {{ settings.color_gold }};">{{ section.settings.cycles }}</span>
          </div>
          <div class="flex justify-between font-mono text-[10px] tracking-widest text-[#c9c6c5] uppercase">
            <span>Signal Distortion Level</span>
            <span>{{ section.settings.distortion }}%</span>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <a href="https://kingshadp.github.io/the-verse" style="border-color: {{ settings.color_gold }}; color: {{ settings.color_gold }};" class="verse-ghost-btn block text-center font-mono text-[9px] uppercase tracking-[0.4em] py-5 px-6 border bg-transparent hover:bg-gold-glow-hover transition-all duration-700">
          RE-ALIGN THE VECTORS
        </a>
      </div>
    </div>

    <!-- Stunning Decorative Astrolabe Graphic -->
    <div class="flex-1 flex items-center justify-center border p-12 relative min-h-[400px]" style="border-color: {{ settings.color_accent }}33;">
      <div class="absolute inset-8 rounded-full border opacity-5 pointer-events-none" style="border-color: {{ settings.color_accent }};"></div>
      <div class="absolute inset-16 rounded-full border opacity-10 pointer-events-none dash-array" style="border-color: {{ settings.color_accent }};"></div>
      
      <svg viewBox="0 0 300 300" class="w-full max-w-[280px] text-platinum">
        <circle cx="150" cy="150" r="142" fill="none" stroke="{{ settings.color_accent }}" stroke-width="1" stroke-opacity="0.3"></circle>
        <circle cx="150" cy="150" r="134" fill="none" stroke="{{ settings.color_accent }}" stroke-width="0.5" stroke-opacity="0.2" stroke-dasharray="3 3"></circle>
        <circle cx="150" cy="150" r="110" fill="none" stroke="{{ settings.color_accent }}" stroke-width="0.75" stroke-opacity="0.2"></circle>
        <circle cx="150" cy="150" r="80" fill="none" stroke="{{ settings.color_gold }}" stroke-width="0.5" stroke-opacity="0.2" stroke-dasharray="20 4"></circle>
        
        <circle cx="195" cy="105" r="4.5" fill="#050505" stroke="{{ settings.color_gold }}" stroke-width="1.5"></circle>
        <circle cx="150" cy="240" r="4.5" fill="#050505" stroke="{{ settings.color_accent }}" stroke-width="1"></circle>
        <circle cx="150" cy="80" r="4.5" fill="#050505" stroke="{{ settings.color_accent }}" stroke-width="1"></circle>
        <circle cx="150" cy="150" r="1.5" fill="{{ settings.color_gold }}"></circle>
      </svg>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "Stellar Constellations",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Aligned Constellations Ledger"
    },
    {
      "type": "textarea",
      "id": "description",
      "label": "Description",
      "default": "Calculated trajectories drawing upon the sovereign nodes of the Avarice grid space."
    },
    {
      "type": "text",
      "id": "constellation",
      "label": "Constellation",
      "default": "The Scepter of Avarice"
    },
    {
      "type": "text",
      "id": "latitude",
      "label": "Latitude",
      "default": "45.0"
    },
    {
      "type": "text",
      "id": "ascension",
      "label": "Right Ascension",
      "default": "12.0"
    },
    {
      "type": "text",
      "id": "cycles",
      "label": "Cycles",
      "default": "3"
    },
    {
      "type": "text",
      "id": "distortion",
      "label": "Distortion Level",
      "default": "4.2"
    }
  ],
  "presets": [
    {
      "name": "Stellar Constellations"
    }
  ]
}
{% endschema %}`;

      const sectionManifestationsLiquid = `<div class="verse-manifestations-section py-32 px-6 lg:px-12 relative" style="background-color: {{ settings.color_bg }}; border-top: 1px solid {{ settings.color_accent }}11;">
  <div class="max-w-7xl mx-auto z-10 relative">
    
    <div class="flex flex-col gap-6 mb-24 border-b pb-12" style="border-color: {{ settings.color_accent }}22;">
      <span class="font-mono text-[9px] uppercase tracking-[0.5em]" style="color: {{ settings.color_gold }};">ARCHITECTURAL_MANIFESTS //</span>
      <h2 class="font-serif text-5xl md:text-7xl font-light text-platinum uppercase leading-none">{{ section.settings.title_manifests }}</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div class="verse-item-card border p-10 flex flex-col justify-between min-h-[420px] transition-all duration-700 group hover:border-[#dcc57b]/30" style="border-color: {{ settings.color_accent }}22; background: rgba(5,5,5,0.85);">
        <div>
          <div class="flex justify-between items-center mb-6">
            <span class="font-mono text-[8px] uppercase tracking-widest text-[#93000a]">Manifestation 01</span>
            <span class="font-mono text-[8px] uppercase tracking-widest font-bold" style="color: {{ settings.color_gold }};">Tome</span>
          </div>
          <h3 class="font-serif text-3xl text-platinum tracking-tight italic group-hover:text-white transition-colors duration-500 mb-6">Avarice Luxury Scepter</h3>
          <p class="font-serif text-sm italic text-platinum/40 leading-relaxed">Solidified gold-fire artifact acting as the primary system core ledger anchor. A heavy physical manifestation of the primary singularity.</p>
        </div>
        <div class="mt-8 pt-6 border-t border-platinum/5 flex justify-between items-center">
          <span class="font-mono text-[9px] uppercase tracking-widest text-[#dcc57b]">Sovereign Tier</span>
          <span class="font-mono text-[9px] uppercase tracking-widest text-platinum/40">Exquisite //</span>
        </div>
      </div>

      <div class="verse-item-card border p-10 flex flex-col justify-between min-h-[420px] transition-all duration-700 group hover:border-[#dcc57b]/30" style="border-color: {{ settings.color_accent }}22; background: rgba(5,5,5,0.85);">
        <div>
          <div class="flex justify-between items-center mb-6">
            <span class="font-mono text-[8px] uppercase tracking-widest text-[#93000a]">Manifestation 02</span>
            <span class="font-mono text-[8px] uppercase tracking-widest font-bold" style="color: {{ settings.color_gold }};">Relic</span>
          </div>
          <h3 class="font-serif text-3xl text-platinum tracking-tight italic group-hover:text-white transition-colors duration-500 mb-6">Platinum Lighthouse</h3>
          <p class="font-serif text-sm italic text-platinum/40 leading-relaxed">The singular uncorrupted beacon inside the center of the void, emitting high-density spatial purges to eliminate navigation interference.</p>
        </div>
        <div class="mt-8 pt-6 border-t border-platinum/5 flex justify-between items-center">
          <span class="font-mono text-[9px] uppercase tracking-widest text-[#dcc57b]">Lighthouse Tier</span>
          <span class="font-mono text-[9px] uppercase tracking-widest text-platinum/40">Uncorrupted //</span>
        </div>
      </div>

      <div class="verse-item-card border p-10 flex flex-col justify-between min-h-[420px] transition-all duration-700 group hover:border-[#dcc57b]/30" style="border-color: {{ settings.color_accent }}22; background: rgba(5,5,5,0.85);">
        <div>
          <div class="flex justify-between items-center mb-6">
            <span class="font-mono text-[8px] uppercase tracking-widest text-[#93000a]">Manifestation 03</span>
            <span class="font-mono text-[8px] uppercase tracking-widest font-bold" style="color: {{ settings.color_gold }};">Anchor</span>
          </div>
          <h3 class="font-serif text-3xl text-platinum tracking-tight italic group-hover:text-white transition-colors duration-500 mb-6">Crimson Eclipse Mass</h3>
          <p class="font-serif text-sm italic text-platinum/40 leading-relaxed">A massive core of deep-friction dark matter drawn in velvet red, indicating the space where the Great severance unfolded.</p>
        </div>
        <div class="mt-8 pt-6 border-t border-platinum/5 flex justify-between items-center">
          <span class="font-mono text-[9px] uppercase tracking-widest text-[#dcc57b]">Forbidden Tier</span>
          <span class="font-mono text-[9px] uppercase tracking-widest text-platinum/40">Volatile //</span>
        </div>
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "Verse Manifestations",
  "settings": [
    {
      "type": "text",
      "id": "title_manifests",
      "label": "Heading",
      "default": "Stellar Manifestations"
    }
  ],
  "presets": [
    {
      "name": "Verse Manifestations"
    }
  ]
}
{% endschema %}`;

      const sectionOracleLiquid = `<div class="verse-oracle-section py-32 px-6 lg:px-12 relative overflow-hidden" style="background-color: {{ settings.color_bg }}; border-top: 1px solid {{ settings.color_accent }}33;">
  <div class="absolute inset-0 atmosphere z-0 opacity-[0.03]"></div>
  
  <div class="max-w-4xl mx-auto text-center relative z-10">
    <div class="flex flex-col items-center gap-6 mb-16">
      <span class="font-mono text-[9px] uppercase tracking-[0.5em]" style="color: {{ settings.color_gold }};">SACRED_DECREE_MONITOR //</span>
      <h2 class="font-serif text-5xl font-light text-platinum uppercase tracking-tight italic">{{ section.settings.title }}</h2>
    </div>

    <div class="border p-12 md:p-16 relative backdrop-blur-md overflow-hidden text-left" style="border-color: {{ settings.color_accent }}44; background: rgba(5,5,5,0.95);">
      <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-80"></div>
      
      <div class="absolute top-0 left-0 w-3 h-3 border-t border-l" style="border-color: {{ settings.color_accent }};"></div>
      <div class="absolute top-0 right-0 w-3 h-3 border-t border-r" style="border-color: {{ settings.color_accent }};"></div>
      <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style="border-color: {{ settings.color_accent }};"></div>
      <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style="border-color: {{ settings.color_accent }};"></div>

      <div class="text-left font-serif leading-loose text-platinum/90 text-xl md:text-2xl italic">
        "{{ section.settings.prophecy_text }}"
      </div>

      <div class="h-px bg-platinum/10 my-10"></div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-mono tracking-widest text-[9px] uppercase" style="color: {{ settings.color_accent }};">
        <span>Oracle Source Status: [ SYSTEM_ACTIVE ]</span>
        <span style="color: {{ settings.color_gold }};">Avarice Luxury Design Engine 2026</span>
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "The Verse Oracle",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "The Oracle's Prophetic Judgment"
    },
    {
      "type": "textarea",
      "id": "prophecy_text",
      "label": "Prophecy text",
      "default": "In the convergence of scepters lies the eternal verification of the absolute luxury void, a black marble harbor of gold and crimson sparks."
    }
  ],
  "presets": [
    {
      "name": "The Verse Oracle"
    }
  ]
}
{% endschema %}`;

      const assetThemeCss = `:root {
  --color-void: #050505;
  --color-platinum: #c9c6c5;
  --color-oxblood: #93000a;
  --color-gold: #dcc57b;
  --font-serif: 'Newsreader', 'Georgia', serif;
  --font-sans: 'Inter', sans-serif;
}

body {
  background-color: var(--color-void);
  color: var(--color-platinum);
  font-family: var(--font-serif);
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

.luxury-cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 5px;
  height: 5px;
  background-color: var(--color-gold);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
}

.luxury-cursor-circle {
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-oxblood);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: transform 0.08s ease-out;
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: var(--color-void);
}
::-webkit-scrollbar-thumb {
  background: var(--color-oxblood);
}

.atmosphere {
  background: radial-gradient(circle at 50% 50%, rgba(147,0,10,0.15) 0%, transparent 80%);
  filter: blur(100px);
}

.luxury-noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(183, 110, 121, 0.05) 0.5px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

.verse-ghost-btn {
  display: inline-block;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  background: transparent;
  color: var(--color-platinum);
  border: 1px solid rgba(201, 198, 197, 0.25);
}

.verse-ghost-btn:hover {
  border-color: var(--color-gold);
  color: #fff;
}

.verse-item-card {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.verse-item-card:hover {
  transform: translateY(-8px);
  border-color: var(--color-gold) !important;
}`;

      const assetThemeJs = `document.addEventListener('DOMContentLoaded', () => {
  const dot = document.querySelector('.luxury-cursor-dot');
  const circle = document.querySelector('.luxury-cursor-circle');

  if (dot && circle) {
    document.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      
      setTimeout(() => {
        circle.style.left = e.clientX + 'px';
        circle.style.top = e.clientY + 'px';
      }, 50);
    });
  }
});`;

      zip.file("layout/theme.liquid", layoutThemeLiquid);
      zip.file("templates/index.json", JSON.stringify(indexJson, null, 2));
      zip.file("sections/the-verse-hero.liquid", sectionHeroLiquid);
      zip.file("sections/the-verse-constellations.liquid", sectionConstellationsLiquid);
      zip.file("sections/the-verse-manifestations.liquid", sectionManifestationsLiquid);
      zip.file("sections/the-verse-oracle.liquid", sectionOracleLiquid);
      zip.file("assets/theme.css", assetThemeCss);
      zip.file("assets/theme.js", assetThemeJs);
      zip.file("config/settings_schema.json", JSON.stringify(settingsSchemaJson, null, 2));
      zip.file("config/settings_data.json", JSON.stringify(settingsDataJson, null, 2));

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `the-verse-avarice-luxury-shopify-theme.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate Shopify theme:", err);
    } finally {
      setIsExporting(false);
    }
  };

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

        // Record trace alignment log entry
        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 11),
          constellation: data.constellation,
          latitude: data.latitude,
          ascension: data.ascension,
          prophecy: data.prophecy,
          timestamp: new Date().toLocaleTimeString(),
        };

        setHistory((prev) => {
          const filtered = prev.filter((item) => item.constellation !== newItem.constellation);
          const updated = [newItem, ...filtered].slice(0, 5);
          try {
            localStorage.setItem("avarice_nav_history", JSON.stringify(updated));
          } catch (e) {
            console.error("Failed writing alignment history:", e);
          }
          return updated;
        });
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
      
      {/* Subtle Slow-Moving Canvas Star Field Anim Backdrop */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none opacity-55"
      />

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

            {/* Alignment History Ledger Listing */}
            {history.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#b76e79]/15 text-left w-full">
                <span className="font-mono text-[8px] text-[#b76e79]/60 tracking-[0.45em] uppercase block mb-4">
                  Sovereign_History_Log
                </span>
                <div className="space-y-2.5">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedConst(item.constellation);
                        setLatitude(item.latitude);
                        setAscension(item.ascension);
                        setResult({
                          constellation: item.constellation,
                          latitude: item.latitude,
                          ascension: item.ascension,
                          idealLat: item.latitude,
                          idealAsc: item.ascension,
                          distortion: 2.4,
                          travelCycles: 4,
                          encounterChance: 6,
                          encounterType: "Sovereign Alignment Restored",
                          statusText: "Reconstitution Complete",
                          isPerfect: true,
                          resourceDetails: "Decoded archive trace log",
                          prophecy: item.prophecy
                        });
                        setHasPlotted(true);
                      }}
                      className="w-full text-left bg-ivory/[0.01]/10 hover:bg-[#93000a]/10 border border-ivory/5 hover:border-[#b76e79]/45 p-3 transition-all duration-500 flex justify-between items-center group cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="font-serif italic text-xs text-ivory group-hover:text-white transition-colors">
                          {item.constellation}
                        </span>
                        <div className="flex gap-2.5 text-[7px] font-mono text-ivory/40">
                          <span>LAT {item.latitude}°</span>
                          <span>RA {item.ascension.toFixed(1)}h</span>
                        </div>
                      </div>
                      <span className="font-mono text-[7px] text-[#dcc57b] border border-[#dcc57b]/20 px-1.5 py-0.5 group-hover:bg-[#dcc57b]/10 transition-colors uppercase">
                        RESTORE
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    <AnimatePresence>
                      {hoveredConst === "The Scepter of Avarice" && (
                        <motion.text
                          initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -3 }} transition={{ duration: 0.3 }}
                          x="205" y="112" fontSize="6" fill="#D9D9D9" textAnchor="start" className="font-serif italic font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        >
                          The Scepter of Avarice
                        </motion.text>
                      )}
                    </AnimatePresence>
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
                    <AnimatePresence>
                      {hoveredConst === "Oxblood Eclipse" && (
                        <motion.text
                          initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.3 }}
                          x="150" y="261" fontSize="6" fill="#D9D9D9" textAnchor="middle" className="font-serif italic font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        >
                          Oxblood Eclipse
                        </motion.text>
                      )}
                    </AnimatePresence>
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
                    <AnimatePresence>
                      {hoveredConst === "Platinum Spire" && (
                        <motion.text
                          initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} transition={{ duration: 0.3 }}
                          x="150" y="63" fontSize="6" fill="#D9D9D9" textAnchor="middle" className="font-serif italic font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        >
                          Platinum Spire
                        </motion.text>
                      )}
                    </AnimatePresence>
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
                    <AnimatePresence>
                      {hoveredConst === "The Silent Lion" && (
                        <motion.text
                          initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} transition={{ duration: 0.3 }}
                          x="260" y="163" fontSize="6" fill="#D9D9D9" textAnchor="middle" className="font-serif italic font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        >
                          The Silent Lion
                        </motion.text>
                      )}
                    </AnimatePresence>
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
                    <AnimatePresence>
                      {hoveredConst === "Obsidian Helix" && (
                        <motion.text
                          initial={{ opacity: 0, x: 3 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 3 }} transition={{ duration: 0.3 }}
                          x="80" y="190" fontSize="6" fill="#D9D9D9" textAnchor="end" className="font-serif italic font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        >
                          Obsidian Helix
                        </motion.text>
                      )}
                    </AnimatePresence>
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

              {/* Dynamic Label Tooltip with High-End Serif Typography */}
              <AnimatePresence>
                {hoveredConst && (
                  <motion.div
                    key={`tooltip-${hoveredConst}`}
                    initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.93, y: 5, filter: "blur(4px)" }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute z-30 pointer-events-none w-[280px] border border-[#b76e79]/35 bg-[#050505]/95 p-5 backdrop-blur-md shadow-[0_15px_40px_rgba(147,0,10,0.25)] flex flex-col justify-between ${NODE_COORDINATES[hoveredConst]?.offset}`}
                    style={{
                      left: NODE_COORDINATES[hoveredConst]?.x,
                      top: NODE_COORDINATES[hoveredConst]?.y,
                    }}
                  >
                    {/* Glowing hairline accents */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#dcc57b] to-transparent opacity-80" />
                    
                    {/* Corner aesthetics */}
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#b76e79]" />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#b76e79]" />
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#b76e79]" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#b76e79]" />

                    {/* Meta Section */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#dcc57b]">
                        {CONSTELLATIONS_INFO.find(c => c.name === hoveredConst)?.sector}
                      </span>
                      <span className="font-mono text-[7px] text-ivory/50">
                        {CONSTELLATIONS_INFO.find(c => c.name === hoveredConst)?.ideal}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-serif italic font-light text-xl text-ivory tracking-tight mb-2 leading-tight">
                      {hoveredConst}
                    </h4>

                    {/* Line description */}
                    <p className="font-serif italic text-xs text-ivory/70 leading-relaxed mb-3">
                      &ldquo;{CONSTELLATIONS_INFO.find(c => c.name === hoveredConst)?.desc}&rdquo;
                    </p>

                    {/* Extended lore in serif/sans mix */}
                    <p className="font-sans text-[10px] text-ivory/40 leading-relaxed max-h-[80px] overflow-hidden">
                      {CONSTELLATIONS_INFO.find(c => c.name === hoveredConst)?.lore}
                    </p>

                    {/* Footer micro data */}
                    <div className="mt-4 pt-2.5 border-t border-ivory/5 flex justify-between items-center">
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[6px] text-ivory/30 uppercase tracking-[0.2em] mb-0.5">Classification</span>
                        <span className="font-mono text-[7px] text-ivory/70 uppercase tracking-widest">
                          {CONSTELLATIONS_INFO.find(c => c.name === hoveredConst)?.tier}
                        </span>
                      </div>
                      <div className="flex flex-col text-right items-end">
                        <span className="font-mono text-[6px] text-ivory/30 uppercase tracking-[0.2em] mb-0.5">Threat Metric</span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#93000a] rounded-full animate-pulse shadow-[0_0_8px_#93000a]" />
                          <span className="font-mono text-[7px] text-[#93000a] tracking-wider uppercase font-semibold">
                            {CONSTELLATIONS_INFO.find(c => c.name === hoveredConst)?.threat}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

            {/* Avarice Custom Shopify Theme Export & PDF Chronicle Module */}
            <div className="mt-8 border-t border-[#b76e79]/15 pt-6 flex flex-col gap-4">
              
              {/* Document/Parchment Chronicle Exporter */}
              <div className="flex justify-between items-center">
                <span className="font-mono text-[8px] text-[#b76e79]/60 tracking-[0.45em] uppercase">
                  DIVINE_MONUMENT_PRINTER
                </span>
                <span className="font-mono text-[7px] text-[#dcc57b] tracking-wider uppercase">
                  Chronicle Drafted
                </span>
              </div>
              <button
                onClick={handlePdfExport}
                disabled={isExportingPdf}
                className={`w-full relative overflow-hidden border transition-all duration-700 font-mono text-[9px] tracking-[0.35em] py-4 px-4 uppercase flex items-center justify-center gap-2.5 ${
                  isExportingPdf
                    ? "border-[#dcc57b] bg-[#93000a]/20 text-[#dcc57b] cursor-wait"
                    : "border-ivory/10 hover:border-[#93000a]/40 bg-ivory/[0.01] hover:bg-[#93000a]/10 text-ivory/60 hover:text-ivory shadow-[0_0_15px_rgba(147,0,10,0.02)] cursor-pointer"
                }`}
              >
                {isExportingPdf ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#dcc57b]" />
                    PRINTING_DIVINE_PARCHMENT_
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#dcc57b]" />
                    Download Parchment Chronicle [PDF]
                  </>
                )}
              </button>

              <div className="h-px bg-[#b76e79]/10 my-1" />

              <div className="flex justify-between items-center">
                <span className="font-mono text-[8px] text-[#b76e79]/60 tracking-[0.45em] uppercase">
                  Avarice_Shopify_Compiler
                </span>
                <span className="font-mono text-[7px] text-[#dcc57b] tracking-wider uppercase">
                  Ready // OS 2.0
                </span>
              </div>
              <button
                onClick={handleShopifyExport}
                disabled={isExporting}
                className={`w-full relative overflow-hidden border transition-all duration-700 font-mono text-[9px] tracking-[0.35em] py-4 px-4 uppercase flex items-center justify-center gap-2.5 ${
                  isExporting
                    ? "border-[#dcc57b] bg-[#93000a]/20 text-[#dcc57b] cursor-wait"
                    : "border-ivory/10 hover:border-[#b76e79] bg-ivory/[0.01] hover:bg-[#93000a]/10 text-ivory/60 hover:text-ivory shadow-[0_0_15px_rgba(147,0,10,0.02)] cursor-pointer"
                }`}
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#dcc57b]" />
                    Compiling_Avarice_Liquid_
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#dcc57b]" />
                    Export Shopify Theme Package
                  </>
                )}
              </button>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
