const fs = require('fs');
const path = require('path');

// 1. Create directory structure for Shopify Theme
const themeDir = path.join(__dirname, 'shopify-theme');
const subDirs = ['layout', 'templates', 'sections', 'snippets', 'config', 'locales', 'assets'];


console.log('// Initializing Shopify Theme Directory Structure...');
subDirs.forEach(dir => {
  const p = path.join(themeDir, dir);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

// Helper to copy binary file
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`Copied asset: ${path.basename(src)} -> ${path.basename(dest)}`);
  } catch (err) {
    console.error(`Error copying ${src}:`, err.message);
  }
}

// Rename map for public assets (remove spaces, parentheses, commas for clean Shopify reference)
const publicAssetsDir = path.join(__dirname, 'public');
const assetsMap = {};

if (fs.existsSync(publicAssetsDir)) {
  const files = fs.readdirSync(publicAssetsDir);
  files.forEach(file => {
    // Clean filename for Shopify asset URL compatibility
    const cleanName = file
      .toLowerCase()
      .replace(/[\s,()_-]+/g, '_')
      .replace(/^[_\s]+|[_\s]+$/g, '')
      .replace(/_png$/i, '.png')
      .replace(/_jpg$/i, '.jpg')
      .replace(/_mp4$/i, '.mp4');
    
    assetsMap[file] = cleanName;
    copyFile(path.join(publicAssetsDir, file), path.join(themeDir, 'assets', cleanName));
  });
}

// 2. Generate shopify-theme/layout/theme.liquid
const themeLiquidContent = `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="">
    <link rel="canonical" href="{{ canonical_url }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    {%- if settings.favicon != blank -%}
      <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
    {%- endif -%}

    <title>
      {{ page_title }}
      {%- if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif -%}
      {%- if current_page != 1 %} &ndash; Page {{ current_page }}{% endif -%}
      {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
    </title>

    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {% render 'meta-tags' %}

    {{ content_for_header }}

    <!-- Fonts: Space Grotesk, Inter, and Cinzel (Editorial Serif) -->
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:ital,wght@0,300..900;1,300..900&family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">

    <!-- CSS Tailored Stylesheet -->
    {{ 'divine-archive.css' | asset_url | stylesheet_tag }}
  </head>

  <body class="bg-void text-ivory antialiased crt-scanlines selection:bg-oxblood selection:text-white">
    <!-- Starfield Interactive Canvas Background -->
    <canvas id="starfield-canvas" class="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-80"></canvas>
    
    <a class="skip-to-content-link button sr-only" href="#MainContent">
      Skip to content
    </a>

    <!-- Custom Micro-Interactive Trailing Cursor -->
    {% render 'custom-cursor' %}

    <!-- Atmosphere & Background Overlays -->
    {% render 'background-effects' %}

    <!-- Accessible Navigation Drawer Dialog overlay -->
    {% render 'menu-overlay' %}

    <!-- Interactive Floating Bookmark CTA -->
    {% render 'floating-action-button' %}

    <!-- Global Layout Container -->
    <div class="relative z-10 w-full flex flex-col min-h-screen">
      {% sections 'header-group' %}

      <main id="MainContent" class="flex-grow w-full focus:none" role="main" tabindex="-1">
        {{ content_for_layout }}
      </main>

      {% sections 'footer-group' %}
    </div>

    <!-- JS Core Framework & Motion Libraries -->
    {{ 'starfield.js' | asset_url | script_tag }}
    {{ 'smooth-scroller.js' | asset_url | script_tag }}
    {{ 'scramble-text.js' | asset_url | script_tag }}
    {{ 'scroll-progress.js' | asset_url | script_tag }}
    {{ 'scroll-particle-burst.js' | asset_url | script_tag }}
    {{ 'divine-archive.js' | asset_url | script_tag }}
  </body>
</html>
`;

fs.writeFileSync(path.join(themeDir, 'layout', 'theme.liquid'), themeLiquidContent);

// 3. Generate shopify-theme/snippets/meta-tags.liquid
const metaTagsContent = `{%- liquid
  assign og_title = page_title | default: shop.name
  assign og_url = canonical_url | default: request.origin
  assign og_type = 'website'
  assign og_description = page_description | default: shop.description | default: shop.name
-%}

<meta property="og:site_name" content="{{ shop.name }}">
<meta property="og:url" content="{{ og_url }}">
<meta property="og:title" content="{{ og_title | escape }}">
<meta property="og:type" content="{{ og_type }}">
<meta property="og:description" content="{{ og_description | escape }}">

{%- if page_image -%}
  <meta property="og:image" content="http:{{ page_image | image_url }}">
  <meta property="og:image:secure_url" content="https:{{ page_image | image_url }}">
  <meta property="og:image:width" content="{{ page_image.width }}">
  <meta property="og:image:height" content="{{ page_image.height }}">
{%- endif -%}

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ og_title | escape }}">
<meta name="twitter:description" content="{{ og_description | escape }}">
`;

fs.writeFileSync(path.join(themeDir, 'snippets', 'meta-tags.liquid'), metaTagsContent);

// 4. Generate shopify-theme/snippets/custom-cursor.liquid
const customCursorContent = `<div id="interactive-cursor-ring" class="fixed top-0 left-0 w-8 h-8 rounded-full border border-ivory/50 pointer-events-none mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-all duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-[9998] opacity-0 hidden md:block"></div>
<div id="interactive-cursor-dot" class="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-ivory pointer-events-none mix-blend-difference -translate-x-1/2 -translate-y-1/2 z-[9999] opacity-0 hidden md:block"></div>
`;

fs.writeFileSync(path.join(themeDir, 'snippets', 'custom-cursor.liquid'), customCursorContent);

// 5. Generate shopify-theme/assets/divine-archive.css
const divinecssContent = `:root {
  --color-void: #fdfbf7;
  --color-ivory: #0a0a0a;
  --color-oxblood: #93000a;
  --color-gold: #dcc57b;
  --font-serif: 'Cinzel', 'Playfair Display', serif;
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  --grid-gap: 32px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background-color: var(--color-void);
  color: var(--color-ivory);
  overflow-x: hidden;
  letter-spacing: 0.02em;
  line-height: 1.6;
}

/* Custom Selection Colors */
::selection {
  background: var(--color-oxblood);
  color: #ffffff;
}

/* Base Accessibility Skiplinks */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.skip-to-content-link:focus {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 10000;
  background-color: var(--color-void);
  color: var(--color-ivory);
  padding: 1rem 2rem;
  font-family: var(--font-mono);
  border: 1px solid var(--color-ivory);
  text-decoration: none;
}

/* Headings and Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.font-mono {
  font-family: var(--font-mono) !important;
}

.font-serif {
  font-family: var(--font-serif) !important;
}

.font-sans {
  font-family: var(--font-sans) !important;
}

/* Subtle Film Grain Noise Texture Overlay */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  opacity: 1;
}

/* Scanlines Retro Display Overlay */
.crt-scanlines::before {
  content: " ";
  display: block;
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.01), rgba(0, 255, 0, 0.005), rgba(0, 0, 255, 0.01));
  z-index: 998;
  background-size: 100% 3px, 3px 100%;
  pointer-events: none;
}

/* Glitch Typography Hover Effect */
@keyframes luxury-data-glitch {
  0% {
    text-shadow: 0.04em 0 0 rgba(147, 0, 10, 0.75), -0.025em -0.04em 0 rgba(220, 197, 123, 0.75);
    letter-spacing: -0.015em;
  }
  15% {
    text-shadow: -0.04em -0.02em 0 rgba(147, 0, 10, 0.75), 0.02em 0.02em 0 rgba(220, 197, 123, 0.75);
    letter-spacing: -0.025em;
  }
  30% {
    text-shadow: 0.02em 0.04em 0 rgba(147, 0, 10, 0.75), -0.04em -0.02em 0 rgba(220, 197, 123, 0.75);
    letter-spacing: -0.010em;
  }
  45% {
    text-shadow: -0.02em -0.02em 0 rgba(147, 0, 10, 0.75), -0.02em -0.04em 0 rgba(220, 197, 123, 0.75);
    letter-spacing: -0.02em;
  }
  60% {
    text-shadow: 0.04em 0.02em 0 rgba(147, 0, 10, 0.75), 0.04em 0.02em 0 rgba(220, 197, 123, 0.75);
    letter-spacing: -0.025em;
  }
  100% {
    text-shadow: none;
    letter-spacing: -0.02em;
  }
}

.glitch-text-hover:hover {
  animation: luxury-data-glitch 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* Layout Utilities resembling responsive Tailwind */
.max-w-7xl {
  max-width: 80rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.w-full {
  width: 100%;
}
.relative {
  position: relative;
}
.fixed {
  position: fixed;
}
.absolute {
  position: absolute;
}
.inset-0 {
  top: 0; right: 0; bottom: 0; left: 0;
}
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.flex-row {
  flex-direction: row;
}
.flex-grow {
  flex-grow: 1;
}
.justify-between {
  justify-content: space-between;
}
.justify-center {
  justify-content: center;
}
.items-center {
  align-items: center;
}
.items-start {
  align-items: flex-start;
}
.items-end {
  align-items: flex-end;
}
.pointer-events-none {
  pointer-events: none;
}
.pointer-events-auto {
  pointer-events: auto;
}

/* Padding & Grid Structuring */
.py-32 {
  padding-top: 8rem;
  padding-bottom: 8rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.pb-24 {
  padding-bottom: 6rem;
}
.pt-20 {
  padding-top: 5rem;
}
.mt-12 {
  margin-top: 3rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.mb-12 {
  margin-bottom: 3rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-8 {
  gap: 2rem;
}
.gap-12 {
  gap: 3rem;
}
.gap-24 {
  gap: 6rem;
}

.text-gold {
  color: var(--color-gold);
}
.text-oxblood {
  color: var(--color-oxblood);
}
.text-ivory {
  color: var(--color-ivory);
}

.grid {
  display: grid;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media(min-width: 768px) {
  .md\\:flex-row {
    flex-direction: row;
  }
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\\:grid-cols-12 {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
  .md\\:col-span-4 {
    grid-column: span 4 / span 4;
  }
  .md\\:col-span-5 {
    grid-column: span 5 / span 5;
  }
  .md\\:col-span-6 {
    grid-column: span 6 / span 6;
  }
  .md\\:col-start-1 {
    grid-column-start: 1;
  }
  .md\\:col-start-4 {
    grid-column-start: 4;
  }
  .md\\:col-start-8 {
    grid-column-start: 8;
  }
  .md\\:col-start-9 {
    grid-column-start: 9;
  }
  .md\\:mt-32 {
    margin-top: 8rem;
  }
  .md\\:mt-48 {
    margin-top: 12rem;
  }
  .md\\:-mt-12 {
    margin-top: -3rem;
  }
  .md\\:-mt-24 {
    margin-top: -6rem;
  }
  .md\\:pl-8 {
    padding-left: 2rem;
  }
}

@media(min-width: 1024px) {
  .lg\\:px-24 {
    padding-left: 6rem;
    padding-right: 6rem;
  }
}

/* Interactive Elements design */
.transition-colors {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}
.transition-transform {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.transition-all {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.hover\\:text-gold:hover {
  color: var(--color-gold);
}
.hover\\:translate-x-2:hover {
  transform: translateX(0.5rem);
}

/* Cinema Card structure */
.aspect-\\[16\\/9\\] {
  aspect-ratio: 16 / 9;
}
.aspect-\\[3\\/4\\] {
  aspect-ratio: 3 / 4;
}
.aspect-\\[4\\/3\\] {
  aspect-ratio: 4 / 3;
}
.aspect-square {
  aspect-ratio: 1 / 1;
}

.border-grid-box {
  border: 1px solid rgba(10, 10, 10, 0.1);
  overflow: hidden;
  position: relative;
  transition: border-color 0.4s ease;
}
.border-grid-box:hover {
  border-color: var(--color-gold);
}

.image-scale-effect {
  width: 100%;
  height: 100%;
  object-cover: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
}

.border-grid-box:hover .image-scale-effect {
  transform: scale(1.05);
  opacity: 0.65;
}

/* Simple Audio Toggles formatting */
.btn-control {
  background: transparent;
  border: 1px solid var(--color-ivory);
  font-family: var(--font-mono);
  color: var(--color-ivory);
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-control:hover {
  background-color: var(--color-ivory);
  color: var(--color-void);
}

/* Overlay Navigation system */
dialog::backdrop {
  background: transparent;
}
dialog[open] {
  animation: modal-fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Micro Audio Waves Animation Visualizer styling */
.audio-visualizer-wave {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 20px;
}
.audio-bar {
  width: 3px;
  height: 3px;
  background-color: var(--color-ivory);
  animation: pulse-wave 1s ease-in-out infinite alternate;
}
.audio-bar:nth-child(2) { animation-delay: 0.15s; }
.audio-bar:nth-child(3) { animation-delay: 0.3s; }
.audio-bar:nth-child(4) { animation-delay: 0.45s; }
.audio-bar:nth-child(5) { animation-delay: 0.6s; }

@keyframes pulse-wave {
  0% { height: 3px; background-color: var(--color-ivory); }
  50% { background-color: var(--color-oxblood); }
  100% { height: 18px; background-color: var(--color-gold); }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  #interactive-cursor-ring, #interactive-cursor-dot {
    display: none !important;
  }
}

/* KINGSHADP CUSTOM LUXURY CSS UPGRADE */
/* Crimson Luxury System & Palette */
.bg-void { background-color: #030303 !important; }
.text-ivory { color: #f4f1eb !important; }
.text-gold { color: #dcc57b !important; }
.text-oxblood { color: #93000a !important; }

/* Custom Ruby Glass Panels */
.ruby-glass {
  background: rgba(147, 0, 10, 0.03) !important;
  backdrop-filter: blur(12px) saturate(120%) !important;
  border: 1px solid rgba(147, 0, 10, 0.15) !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5) !important;
}
.ruby-glass-hover:hover {
  background: rgba(147, 0, 10, 0.07) !important;
  border-color: rgba(220, 197, 123, 0.4) !important;
  box-shadow: 0 8px 32px 0 rgba(147, 0, 10, 0.15) !important;
}

/* Rose-Gold and Platinum Trim accents */
.rose-gold-glow {
  text-shadow: 0 0 10px rgba(220, 197, 123, 0.3) !important;
}
.border-platinum {
  border-color: rgba(244, 241, 235, 0.12) !important;
}
.border-gold-accent {
  border-color: rgba(220, 197, 123, 0.3) !important;
}

/* Audio Player and Lyrics classes */
.music-console-player {
  background: rgba(3, 3, 3, 0.85);
  border: 1px solid rgba(220, 197, 123, 0.15);
}
.lyrics-panel-hidden {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.lyrics-panel-visible {
  max-height: 1000px;
  opacity: 1;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Modern Layouts and Grids */
.editorial-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 2rem;
}
.editorial-col-4 { grid-column: span 4 / span 4; }
.editorial-col-8 { grid-column: span 8 / span 8; }
.editorial-col-12 { grid-column: span 12 / span 12; }

/* Custom Lightbox Styles */
#gallery-lightbox {
  background: rgba(0, 0, 0, 0.95) !important;
  backdrop-filter: blur(20px) !important;
}

/* Scroll reveal helper classes */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}
`;

fs.writeFileSync(path.join(themeDir, 'assets', 'divine-archive.css'), divinecssContent);

// 6. Generate shopify-theme/assets/starfield.js
const starfieldjsContent = `(function() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let numStars = 100;
  let speed = 0.4;
  let acceleration = 1.0;
  let lastScrollY = window.scrollY;

  // Track window size and match canvas size
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        color: Math.random() > 0.85 ? '#dcc57b' : (Math.random() > 0.95 ? '#93000a' : '#0a0a0a'),
        r: Math.random() * 1.5 + 0.5
      });
    }
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Speed increases briefly upon scrolls
    if (acceleration > 1.0) {
      acceleration -= 0.03;
    } else {
      acceleration = 1.0;
    }

    const currentSpeed = speed * acceleration;

    stars.forEach(star => {
      // Slow vector drift
      star.z -= currentSpeed;
      if (star.z <= 0) {
        star.z = canvas.width;
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
      }

      // 3D projections helper
      const k = 128.0 / star.z;
      const px = (star.x - canvas.width / 2) * k + canvas.width / 2;
      const py = (star.y - canvas.height / 2) * k + canvas.height / 2;

      if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
        const size = (1.0 - star.z / canvas.width) * star.r * 2.5;
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 1.0 - (star.z / canvas.width);
        ctx.arc(px, py, Math.max(0.2, size), 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(update);
  }

  // Double speed momentarily on scroll triggers
  window.addEventListener('scroll', () => {
    const factor = Math.abs(window.scrollY - lastScrollY) * 0.15;
    acceleration = Math.min(12.0, acceleration + factor);
    lastScrollY = window.scrollY;
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
  update();
})();
`;

fs.writeFileSync(path.join(themeDir, 'assets', 'starfield.js'), starfieldjsContent);

// 7. Generate shopify-theme/assets/divine-archive.js
const divinejsContent = `(function() {
  // 1. UTC Micro Ticker Display
  const clockEl = document.querySelector('.nav-system-clock');
  if (clockEl) {
    setInterval(() => {
      const d = new Date();
      const h = d.getUTCHours().toString().padStart(2, '0');
      const m = d.getUTCMinutes().toString().padStart(2, '0');
      const s = d.getUTCSeconds().toString().padStart(2, '0');
      const ms = d.getUTCMilliseconds().toString().padStart(3, '0');
      clockEl.innerHTML = \`\${h}:\${m}:\${s}.\${ms} <span class="text-oxblood font-mono">UTC</span>\`;
    }, 45);
  }

  // 2. Micro-Interactive Cursor Tracking
  const ring = document.getElementById('interactive-cursor-ring');
  const dot = document.getElementById('interactive-cursor-dot');

  if (ring && dot) {
    let mouseX = -100, mouseY = -100;
    
    // Check if touch device - do not activate custom mouse representation
    if (window.matchMedia('(pointer: coarse)').matches) {
      ring.style.display = 'none';
      dot.style.display = 'none';
      document.body.style.cursor = 'auto';
    } else {
      document.body.style.cursor = 'none';
      ring.style.opacity = '1';
      dot.style.opacity = '1';

      document.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = \`\${mouseX}px\`;
        dot.style.top = \`\${mouseY}px\`;
        
        // Track hoverable standard list elements
        const target = e.target;
        if (target && (target.closest('button, a, input, [role="button"], .interactive') || target.classList.contains('glitch-text-hover'))) {
          ring.style.width = '56px';
          ring.style.height = '56px';
          ring.style.borderColor = '#dcc57b';
        } else {
          ring.style.width = '32px';
          ring.style.height = '32px';
          ring.style.borderColor = 'rgba(10,10,10,0.5)';
        }
      }, { passive: true });

      // Follow lag ring
      let rX = -100, rY = -100;
      function step() {
        rX += (mouseX - rX) * 0.12;
        rY += (mouseY - rY) * 0.12;
        ring.style.left = \`\${rX}px\`;
        ring.style.top = \`\${rY}px\`;
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  // 3. Simple Letter Text-Scrambler Effect
  const scrambleElements = document.querySelectorAll('.scramble-text');
  
  function scrambleText(element) {
    const original = element.getAttribute('data-scramble-original') || element.textContent;
    if (!element.getAttribute('data-scramble-original')) {
      element.setAttribute('data-scramble-original', original);
    }
    const glyphs = 'ABCDEFGHIKLMNOPQRSTVXYZ[0123456789]//_++';
    let iterations = 0;
    const maxIterations = original.length;
    
    const interval = setInterval(() => {
      element.textContent = original
        .split('')
        .map((char, index) => {
          if (char === ' ') return char;
          if (index < iterations) {
            return original[index];
          }
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');
      
      iterations += 1/2;
      if (iterations >= maxIterations) {
        element.textContent = original;
        clearInterval(interval);
      }
    }, 20);
  }

  scrambleElements.forEach(el => {
    // Scramble once on initialize
    setTimeout(() => scrambleText(el), Math.random() * 800);
    
    // Scramble on hovering
    el.addEventListener('mouseenter', () => scrambleText(el));
  });

  // 4. Custom Menu Drawer Dialog Toggle
  const menuBtn = document.getElementById('shopify-menu-trigger');
  const menuDialog = document.getElementById('shopify-menu-overlay');
  const menuCloseBtn = document.getElementById('shopify-menu-close');

  if (menuBtn && menuDialog) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      menuDialog.showModal();
      document.body.style.overflow = 'hidden';
    });

    const closeHandler = (e) => {
      if (e) e.preventDefault();
      menuDialog.close();
      document.body.style.overflow = '';
    };

    if (menuCloseBtn) {
       menuCloseBtn.addEventListener('click', closeHandler);
    }

    menuDialog.addEventListener('cancel', closeHandler);
  }

  // 5. Liquid Multi-Track Sovereign Audio System
  const coreAudio = document.getElementById('core-audio-element');
  const trackTriggers = document.querySelectorAll('.active-track-trigger');
  const waveBars = document.querySelectorAll('.audio-bar');
  const lyricsWidget = document.getElementById('lyrics-parent-widget');
  const lyricsPanel = document.getElementById('telemetry-panel-lyrics');
  const behindPanel = document.getElementById('telemetry-panel-behind');
  const closePanelBtn = document.getElementById('close-telemetry-panel');
  const tabLyrics = document.getElementById('tab-lyrics-trigger');
  const tabBehind = document.getElementById('tab-behind-trigger');

  let isCurrentlyPlaying = false;

  function updateVisualizer(state) {
    waveBars.forEach(bar => {
      if (state) {
        bar.classList.add('running');
        bar.style.animationPlayState = 'running';
      } else {
        bar.classList.remove('running');
        bar.style.animationPlayState = 'paused';
        bar.style.height = '3.5px';
      }
    });
  }

  if (trackTriggers && trackTriggers.length > 0) {
    trackTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const targetSrc = trigger.getAttribute('data-audio-src');
        const lyricTxt = trigger.getAttribute('data-lyrics-content');
        const behindTxt = trigger.getAttribute('data-behind-content');

        // Toggle selections style outlines
        trackTriggers.forEach(t => {
          t.classList.remove('bg-white/5', 'text-gold');
          t.querySelector('button').innerText = '▶';
        });

        trigger.classList.add('bg-white/5', 'text-gold');
        trigger.querySelector('button').innerText = '⏸';

        // Load content to logs panel
        if (lyricsWidget) {
          lyricsWidget.classList.remove('hidden');
          if (lyricsPanel) lyricsPanel.innerHTML = lyricTxt;
          if (behindPanel) behindPanel.innerHTML = behindTxt;
        }

        if (coreAudio && targetSrc) {
          if (coreAudio.getAttribute('src') !== targetSrc) {
            coreAudio.setAttribute('src', targetSrc);
            coreAudio.load();
            isCurrentlyPlaying = false;
          }

          if (isCurrentlyPlaying) {
            coreAudio.pause();
            isCurrentlyPlaying = false;
            updateVisualizer(false);
            trigger.querySelector('button').innerText = '▶';
          } else {
            coreAudio.play().then(() => {
              isCurrentlyPlaying = true;
              updateVisualizer(true);
            }).catch(() => {
              // Browser block safety fallback
              isCurrentlyPlaying = true;
              updateVisualizer(true);
            });
          }
        } else {
          isCurrentlyPlaying = !isCurrentlyPlaying;
          updateVisualizer(isCurrentlyPlaying);
          trigger.querySelector('button').innerText = isCurrentlyPlaying ? '⏸' : '▶';
        }
      });
    });
  }

  if (closePanelBtn && lyricsWidget) {
    closePanelBtn.addEventListener('click', () => {
      lyricsWidget.classList.add('hidden');
    });
  }

  if (tabLyrics && tabBehind) {
    tabLyrics.addEventListener('click', () => {
      tabLyrics.classList.add('text-gold', 'border-gold');
      tabLyrics.classList.remove('text-ivory/40');
      tabBehind.classList.remove('text-gold', 'border-gold');
      tabBehind.classList.add('text-ivory/40');
      if (lyricsPanel) lyricsPanel.classList.remove('hidden');
      if (behindPanel) behindPanel.classList.add('hidden');
    });

    tabBehind.addEventListener('click', () => {
      tabBehind.classList.add('text-gold', 'border-gold');
      tabBehind.classList.remove('text-ivory/40');
      tabLyrics.classList.remove('text-gold', 'border-gold');
      tabLyrics.classList.add('text-ivory/40');
      if (behindPanel) behindPanel.classList.remove('hidden');
      if (lyricsPanel) lyricsPanel.classList.add('hidden');
    });
  }

  // 6. Lookbook Multi-Interactive Editorial Lightbox
  const lightboxTrigger = document.querySelectorAll('.asset-lightbox-trigger');
  const lightboxEl = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-main-img');
  const lightboxTitle = document.getElementById('lightbox-main-title');
  const lightboxDescr = document.getElementById('lightbox-main-descr');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const lightboxBgDismiss = document.getElementById('lightbox-bg-dismiss');

  if (lightboxEl) {
    lightboxTrigger.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const fullSrc = trigger.getAttribute('data-full-src');
        const titleText = trigger.getAttribute('data-title');
        const descrText = trigger.getAttribute('data-descr');

        if (lightboxImg) lightboxImg.src = fullSrc;
        if (lightboxTitle) lightboxTitle.innerText = titleText;
        if (lightboxDescr) lightboxDescr.innerText = descrText;

        lightboxEl.removeAttribute('open');
        lightboxEl.showModal();
        lightboxEl.style.opacity = '1';
        lightboxEl.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightboxEl.style.opacity = '0';
      lightboxEl.style.pointerEvents = 'none';
      setTimeout(() => {
        lightboxEl.close();
        document.body.style.overflow = '';
      }, 300);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBgDismiss) lightboxBgDismiss.addEventListener('click', closeLightbox);
    lightboxEl.addEventListener('cancel', closeLightbox);
  }

  // 7. Product Multi-Image Thumbnail Calibrations
  const thumbTriggers = document.querySelectorAll('.thumbnails-trigger');
  const mainProductView = document.getElementById('product-main-view');

  if (thumbTriggers && mainProductView) {
    thumbTriggers.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const targetSrc = thumb.getAttribute('data-target-src');
        mainProductView.src = targetSrc;
        thumbTriggers.forEach(t => t.style.borderColor = 'rgba(244, 241, 235, 0.1)');
        thumb.style.borderColor = '#dcc57b';
      });
    });
  }

  // 8. Scroll Zoom Reveals Effects
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  function checkReveal() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top <= windowHeight * 0.88) {
        el.classList.add('revealed');
      }
    });
  }
  window.addEventListener('scroll', checkReveal);
  checkReveal();

  // 9. Voice-to-Text Input Terminal System
  const voiceBtn = document.getElementById('voice-trigger-btn');
  const searchInput = document.getElementById('search-console-input');
  const voiceHud = document.getElementById('voice-hud-ticker');
  const voiceStatus = document.getElementById('voice-hud-status');
  const voiceIndicator = document.getElementById('voice-hud-indicator');

  if (voiceBtn && searchInput) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      voiceBtn.style.display = 'none';
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let isListening = false;

      recognition.onstart = () => {
        isListening = true;
        voiceBtn.classList.add('text-oxblood', 'animate-pulse');
        voiceBtn.classList.remove('text-ivory/40');
        if (voiceHud) voiceHud.classList.remove('hidden');
        if (voiceIndicator) {
          voiceIndicator.classList.add('bg-oxblood');
          voiceIndicator.classList.remove('bg-gold');
        }
        if (voiceStatus) voiceStatus.innerText = 'STATUS: ACTIVE_VOICE_CAPTURE_RUNNING... SPEAK NOW';
        searchInput.placeholder = 'SPEAK DIRECTIVE... [ LISTENING ]';
      };

      recognition.onspeechend = () => {
        recognition.stop();
      };

      recognition.onend = () => {
        isListening = false;
        voiceBtn.classList.remove('text-oxblood', 'animate-pulse');
        voiceBtn.classList.add('text-ivory/40');
        if (voiceStatus) voiceStatus.innerText = 'STATUS: TRANSCRIPTION_COMPLETE';
        setTimeout(() => {
          if (!isListening && voiceHud) voiceHud.classList.add('hidden');
          searchInput.placeholder = 'ENTER FREQUENCY TARGET/KEYWORD...';
        }, 3000);
      };

      recognition.onerror = (event) => {
        isListening = false;
        voiceBtn.classList.remove('text-oxblood', 'animate-pulse');
        voiceBtn.classList.add('text-ivory/40');
        if (voiceStatus) {
          voiceStatus.innerText = 'ERROR: ' + event.error.toUpperCase();
        }
        if (voiceIndicator) {
          voiceIndicator.classList.add('bg-oxblood');
          voiceIndicator.classList.remove('bg-gold');
        }
        setTimeout(() => {
          if (!isListening && voiceHud) voiceHud.classList.add('hidden');
          searchInput.placeholder = 'ENTER FREQUENCY TARGET/KEYWORD...';
        }, 4000);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript.toUpperCase();
        if (voiceStatus) voiceStatus.innerText = 'SIGNAL_CAPTURED: "' + transcript.toUpperCase() + '"';
        setTimeout(() => {
          searchInput.form.submit();
        }, 800);
      };

      voiceBtn.addEventListener('click', () => {
        if (isListening) {
          recognition.stop();
        } else {
          try {
            recognition.start();
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  }

})();
`;

fs.writeFileSync(path.join(themeDir, 'assets', 'divine-archive.js'), divinejsContent);

// 8. Generate shopify-theme/sections/header.liquid
const headerContent = `{% schema %}
{
  "name": "Header System",
  "tag": "section",
  "class": "shopify-section-header",
  "settings": [
    {
      "type": "text",
      "id": "branding",
      "label": "Brand Title",
      "default": "KingShadP"
    },
    {
      "type": "text",
      "id": "latency_text",
      "label": "Latency Ticker Text",
      "default": "SYS.LATENCY_NORM"
    },
    {
      "type": "link_list",
      "id": "menu",
      "label": "Branding Menu Directory",
      "default": "main-menu"
    }
  ]
}
{% endschema %}

<nav class="fixed top-0 left-0 right-0 z-40 p-6 lg:p-10 flex justify-between items-start pointer-events-none" id="theme-header">
  <div class="flex flex-col gap-1 pointer-events-auto">
    <a href="{{ routes.root_url }}" class="font-serif text-2xl text-ivory font-light italic tracking-tight opacity-90 cursor-pointer origin-left hover:scale-105 transition-transform style-free decoration-none" style="text-decoration: none; color: inherit;">
      {{ section.settings.branding }}<span class="text-oxblood">.</span>
    </a>
    <div class="font-mono text-[9px] text-ivory/50 uppercase tracking-[0.4em] flex items-center gap-2">
      <div class="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" style="animation: pulse 1.5s infinite;"></div>
      <span>{{ section.settings.latency_text }}</span>
    </div>
  </div>

  <div class="flex flex-col items-end gap-2 pointer-events-auto">
    <button
      id="shopify-menu-trigger"
      class="font-mono text-xs text-ivory uppercase tracking-widest opacity-80 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold bg-transparent border-0 cursor-crosshair"
      aria-label="Open menu"
    >
      [ Menu ]
    </button>
    <div class="font-mono text-[10px] text-ivory/40 tracking-[0.2em] mt-2 nav-system-clock">
      00:00:00.000 <span class="text-oxblood">UTC</span>
    </div>
  </div>
</nav>

<!-- Asymmetrical Navigation Drawer -->
<dialog id="shopify-menu-overlay" class="fixed inset-0 z-50 w-full h-full max-w-none max-h-none p-0 m-0 bg-void text-ivory backdrop:bg-transparent overflow-hidden border-0">
  <div class="absolute top-0 left-0 right-0 p-6 lg:p-10 flex justify-between items-start z-20 pointer-events-none">
    <div class="flex flex-col gap-1 pointer-events-auto">
      <div class="font-serif text-2xl text-ivory font-light italic tracking-tight opacity-90">
        {{ section.settings.branding }}<span class="text-oxblood">.</span>
      </div>
    </div>
    <button
      id="shopify-menu-close"
      class="text-ivory bg-transparent border-0 font-mono text-xs tracking-widest uppercase hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold pointer-events-auto cursor-crosshair"
      aria-label="Close menu"
    >
      [ Close ]
    </button>
  </div>

  <div class="w-full h-full flex flex-col md:flex-row">
    <!-- Collapsible Visual Frame -->
    <div class="hidden md:block w-3/5 h-full relative overflow-hidden bg-void">
      <!-- Embedded background looping video representing KingShadP styling -->
      <video
        src="{{ 'model_wearing_kingshadp_hoodie_202605270727.mp4' | asset_url }}"
        autoplay
        muted
        loop
        playsinline
        class="w-full h-full object-cover filter contrast-[1.1] saturate-50 brightness-[0.85] opacity-35"
      ></video>
    </div>

    <!-- Asymmetrical Navigation Items -->
    <div class="flex-1 h-full flex flex-col justify-center px-8 lg:px-24 pt-32 pb-24 border-l border-ivory/10">
      <nav class="flex flex-col gap-8 md:gap-12 relative z-10 w-full md:items-end md:text-right">
        {%- if section.settings.menu != blank -%}
          {%- for link in linklists[section.settings.menu].links -%}
            <a
              href="{{ link.url }}"
              class="font-serif text-5xl lg:text-7xl font-light italic text-ivory hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold group decoration-none"
              style="text-decoration: none;"
            >
              <span class="text-xs font-mono tracking-widest text-oxblood mr-4 opacity-50 group-hover:opacity-100 uppercase align-middle">
                0{{ forloop.index }}
              </span>
              {{ link.title }}
            </a>
          {%- endfor -%}
        {%- else -%}
          <!-- Fallback Links matching Original Design Directory -->
          <a href="#the-verse" class="font-serif text-5xl lg:text-7xl font-light italic text-ivory hover:text-gold transition-colors focus:ring-gold decoration-none" style="text-decoration: none;">
            <span class="text-xs font-mono tracking-widest text-oxblood mr-4">01</span>The Verse
          </a>
          <a href="#visual-vault" class="font-serif text-5xl lg:text-7xl font-light italic text-ivory hover:text-gold transition-colors focus:ring-gold decoration-none" style="text-decoration: none;">
            <span class="text-xs font-mono tracking-widest text-oxblood mr-4">02</span>Visual Vault
          </a>
          <a href="#cinema-vault" class="font-serif text-5xl lg:text-7xl font-light italic text-ivory hover:text-gold transition-colors focus:ring-gold decoration-none" style="text-decoration: none;">
            <span class="text-xs font-mono tracking-widest text-oxblood mr-4">03</span>Cinema Vault
          </a>
          <a href="#archives" class="font-serif text-5xl lg:text-7xl font-light italic text-ivory hover:text-gold transition-colors focus:ring-gold decoration-none" style="text-decoration: none;">
            <span class="text-xs font-mono tracking-widest text-oxblood mr-4">04</span>Archives
          </a>
        {%- endif -%}
      </nav>

      <!-- Interactive Locale / Language Selectors -->
      <div class="mt-auto pt-16 flex justify-end gap-4 font-mono text-xs tracking-widest opacity-60">
        <span class="text-gold border-b border-gold cursor-pointer">EN</span>
        <span class="hover:text-ivory cursor-pointer">IT</span>
        <span class="hover:text-ivory cursor-pointer">DE</span>
      </div>
    </div>
  </div>
</dialog>
<style>
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
</style>
`;

fs.writeFileSync(path.join(themeDir, 'sections', 'header.liquid'), headerContent);

// 9. Generate shopify-theme/sections/hero-divine-archive.liquid
const heroContent = `{% schema %}
{
  "name": "Divine Archive Hero",
  "tag": "section",
  "class": "section-hero",
  "settings": [
    {
      "type": "text",
      "id": "telemetry_index",
      "label": "Telemetry Code Label",
      "default": "[ PROTOCOL V9 ]"
    },
    {
      "type": "text",
      "id": "telemetry_tag_1",
      "label": "Telemetry Tag 1",
      "default": "Archive_v9.0"
    },
    {
      "type": "text",
      "id": "telemetry_tag_2",
      "label": "Telemetry Tag 2",
      "default": "Sovereign_Active"
    },
    {
      "type": "text",
      "id": "telemetry_tag_3",
      "label": "Telemetry Tag 3",
      "default": "Class_Omega"
    },
    {
      "type": "text",
      "id": "sub_header",
      "label": "Sub Header Text",
      "default": "Intelligence Archive v.9.0"
    },
    {
      "type": "text",
      "id": "main_title_line1",
      "label": "Main Title Line 1",
      "default": "THE"
    },
    {
      "type": "text",
      "id": "main_title_line2",
      "label": "Main Title Line 2",
      "default": "VERSE."
    },
    {
      "type": "text",
      "id": "identity_footer",
      "label": "Identity Footer Copy",
      "default": "KingShadP | The Official Intelligence"
    }
  ]
}
{% endschema %}

<section class="relative w-full min-h-screen flex flex-col justify-center px-6 lg:px-24 overflow-hidden z-10 selection:bg-ivory selection:text-void">
  <!-- Dynamic Watermark Scrambler background -->
  <div class="absolute right-[-10vw] top-[10vh] text-[15vw] font-mono text-ivory/[0.04] mix-blend-overlay rotate-90 pointer-events-none uppercase whitespace-nowrap overflow-hidden select-none">
    {{ section.settings.telemetry_index }}
  </div>

  <!-- Vertical Telemetry Labels Column -->
  <div class="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-12 text-[10px] font-mono text-ivory/30 tracking-[0.3em] uppercase select-none">
    <span class="origin-left -rotate-90">{{ section.settings.telemetry_tag_1 }}</span>
    <span class="origin-left -rotate-90 text-oxblood">{{ section.settings.telemetry_tag_2 }}</span>
    <span class="origin-left -rotate-90">{{ section.settings.telemetry_tag_3 }}</span>
  </div>

  <div class="max-w-7xl mx-auto w-full pt-28 pb-12 relative z-10">
    <div class="flex items-center gap-4 mb-6">
      <div class="w-12 h-[1px] bg-gold" style="box-shadow: 0 0 10px rgba(220,197,123,0.8);"></div>
      <span class="font-mono text-xs text-ivory/80 uppercase tracking-[0.4em] font-bold scramble-text">
        {{ section.settings.sub_header }}
      </span>
    </div>

    <!-- Monumental Typography -->
    <div class="relative overflow-visible leading-[0.85] pb-4">
      <h1 class="font-serif text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] leading-[0.85] text-ivory font-light tracking-tighter">
        <span class="glitch-text-hover inline-block select-none">{{ section.settings.main_title_line1 }}</span><br />
        <span class="glitch-text-hover inline-block select-none text-transparent bg-clip-text bg-gradient-to-b from-ivory to-ivory/50 relative">
          {{ section.settings.main_title_line2 }}
        </span>
      </h1>
    </div>

    <!-- Identity Sub-caption -->
    <div class="mt-12 max-w-2xl">
      <div class="font-serif text-2xl md:text-3xl text-ivory/90 leading-relaxed font-light scramble-text">
        {{ section.settings.identity_footer }}
      </div>
    </div>
    
    <!-- Trajectory Laser Line -->
    <div class="h-[1px] bg-gradient-to-r from-ivory/30 via-gold/40 to-transparent max-w-lg mt-16" style="box-shadow: 0 0 15px rgba(220,197,123,0.6);"></div>
  </div>
</section>
`;

fs.writeFileSync(path.join(themeDir, 'sections', 'hero-divine-archive.liquid'), heroContent);

// 10. Generate shopify-theme/sections/archive-editorial-grid.liquid
const gridContent = `{% schema %}
{
  "name": "Editorial Grid Directory",
  "tag": "section",
  "class": "section-editorial-grid",
  "settings": [
    {
      "type": "text",
      "id": "section_title",
      "label": "Section Heading",
      "default": "Primary Artifacts"
    }
  ],
  "blocks": [
    {
      "type": "artifact",
      "name": "Artifact specifications",
      "settings": [
        {
          "type": "text",
          "id": "index",
          "label": "Index Display (e.g. 01)",
          "default": "01"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Artifact Label Name",
          "default": "The Silent Protocol"
        },
        {
          "type": "url",
          "id": "link",
          "label": "Link Location"
        }
      ]
    }
  ]
}
{% endschema %}

<section id="the-verse" class="relative w-full py-20 px-6 lg:px-24 z-10 border-t border-ivory/10 bg-transparent overflow-hidden">
  <div class="max-w-7xl mx-auto w-full relative z-10">
    <div class="flex flex-col lg:flex-row gap-12 lg:gap-24">
      <div class="flex-grow">
        <h2 class="font-serif text-5xl lg:text-6xl text-ivory font-light mb-8">
          {{ section.settings.section_title }}<span class="text-gold">.</span>
        </h2>
      </div>
      <div class="flex-none w-full lg:w-3/5 flex flex-col gap-8 font-mono text-sm tracking-[0.2em] uppercase text-ivory/80">
        {%- if section.blocks.size > 0 -%}
          {%- for block in section.blocks -%}
            <a href="{{ block.settings.link | default: '#' }}" class="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all cursor-crosshair decoration-none" style="color: inherit; text-decoration: none;" {{ block.shopify_attributes }}>
              <span class="text-oxblood">{{ block.settings.index }} //</span> {{ block.settings.title }}
            </a>
          {%- endfor -%}
        {%- else -%}
          <!-- Default Mock list fitting Original Page -->
          <div class="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all cursor-crosshair">
            <span class="text-oxblood">01 //</span> The Silent Protocol
          </div>
          <div class="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all cursor-crosshair">
            <span class="text-oxblood">02 //</span> Vision Architect
          </div>
          <div class="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all cursor-crosshair">
            <span class="text-oxblood">03 //</span> Echo Directive
          </div>
          <div class="flex items-center gap-4 hover:text-gold hover:translate-x-2 transition-all cursor-crosshair">
            <span class="text-oxblood">04 //</span> Final Command
          </div>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>
`;

fs.writeFileSync(path.join(themeDir, 'sections', 'archive-editorial-grid.liquid'), gridContent);

// 11. Generate shopify-theme/sections/music-vault.liquid
const musicContent = `{% schema %}
{
  "name": "The Sonic Vault",
  "tag": "section",
  "class": "section-music-vault",
  "settings": [
    {
      "type": "text",
      "id": "label_meta",
      "label": "Top Category Tag",
      "default": "Decrypted Directory"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Section Heading",
      "default": "The Sonic Vault"
    },
    {
      "type": "text",
      "id": "vault_heading",
      "label": "Vault Block Title",
      "default": "Signature Details Vol. 1"
    },
    {
      "type": "text",
      "id": "vault_description",
      "label": "Description Copy",
      "default": "High-Fidelity Audio Fragments extracted from the central archive."
    }
  ]
}
{% endschema %}

<section class="relative w-full py-20 px-6 lg:px-24 z-10 border-t border-ivory/10 bg-transparent overflow-hidden">
  <div class="max-w-7xl mx-auto w-full relative z-10">
    <p class="font-mono text-[10px] text-ivory/40 tracking-[0.3em] uppercase mb-4">{{ section.settings.label_meta }}</p>
    <h2 class="font-serif text-5xl lg:text-7xl text-ivory font-light mb-12">
      {{ section.settings.title }}
    </h2>
    <div class="bg-ivory/[0.03] border border-ivory/10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group hover:border-gold/30 transition-colors">
      <div class="flex flex-col gap-2 relative z-10 max-w-xl">
        <h4 class="font-serif text-2xl text-ivory font-light group-hover:text-gold transition-colors">{{ section.settings.vault_heading }}</h4>
        <p class="font-mono text-xs text-ivory/60 tracking-[0.1em] uppercase">
          // {{ section.settings.vault_description }}
        </p>
      </div>

      <!-- Real Web Audio Interactive Interface block -->
      <div class="flex items-center gap-6 relative z-10 pointer-events-auto">
        <!-- Pulse oscillations animation fallback -->
        <div class="audio-visualizer-wave">
          <div class="audio-bar"></div>
          <div class="audio-bar"></div>
          <div class="audio-bar"></div>
          <div class="audio-bar"></div>
          <div class="audio-bar"></div>
        </div>

        <button id="sonic-audio-play" class="btn-control font-mono">
          [ Listen_Protocol ]
        </button>
      </div>
    </div>
  </div>
</section>
`;

fs.writeFileSync(path.join(themeDir, 'sections', 'music-vault.liquid'), musicContent);

// 12. Generate shopify-theme/sections/cinema-vault.liquid
const cinemaContent = `{% schema %}
{
  "name": "Cinema Vault Garments",
  "tag": "section",
  "class": "section-cinema-vault",
  "settings": [
    {
      "type": "text",
      "id": "meta_tag",
      "label": "Category Label",
      "default": "Class: OMEGA"
    },
    {
      "type": "text",
      "id": "section_title",
      "label": "Section Heading",
      "default": "Cinema Vault"
    }
  ],
  "blocks": [
    {
      "type": "product_card",
      "name": "Garment / Product",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Product Title Name",
          "default": "The Platinum Standard"
        },
        {
          "type": "image_picker",
          "id": "image",
          "label": "Product Image"
        },
        {
          "type": "text",
          "id": "asset_name",
          "label": "Fallback Asset Name",
          "info": "Used if no picker image is assigned"
        },
        {
          "type": "text",
          "id": "price",
          "label": "Coordinates/Price Label",
          "default": "SPEC: // 120.00"
        },
        {
          "type": "url",
          "id": "link",
          "label": "Product Purchase Link"
        }
      ]
    }
  ]
}
{% endschema %}

<section id="cinema-vault" class="relative w-full py-20 px-6 lg:px-24 z-10 border-t border-ivory/10 bg-transparent overflow-hidden">
  <div class="max-w-7xl mx-auto w-full relative z-10">
    <p class="font-mono text-[10px] text-ivory/40 tracking-[0.3em] uppercase mb-4">{{ section.settings.meta_tag }}</p>
    <h2 class="font-serif text-5xl lg:text-7xl text-ivory font-light mb-12">
      {{ section.settings.section_title }}
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      {%- if section.blocks.size > 0 -%}
        {%- for block in section.blocks -%}
          <div class="aspect-[16/9] border border-ivory/10 relative group cursor-crosshair overflow-hidden border-grid-box" {{ block.shopify_attributes }}>
            {%- if block.settings.image != blank -%}
              <img src="{{ block.settings.image | image_url: width: 1024 }}" alt="{{ block.settings.title | escape }}" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-25 image-scale-effect">
            {%- elsif block.settings.asset_name != blank -%}
              <img src="{{ block.settings.asset_name | asset_url }}" alt="{{ block.settings.title | escape }}" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-25 image-scale-effect">
            {%- else -%}
              <div class="absolute inset-0 w-full h-full bg-ivory/[0.02]"></div>
            {%- endif -%}
            
            <a href="{{ block.settings.link | default: '#' }}" class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center decoration-none" style="text-decoration: none; color: inherit;">
              <h4 class="font-serif text-2xl text-ivory font-light italic group-hover:text-gold transition-colors">{{ block.settings.title }}</h4>
              <p class="font-mono text-[10px] text-ivory/40 tracking-[0.2em] uppercase mt-2 group-hover:text-gold/80 transition-colors">{{ block.settings.price }}</p>
            </a>
          </div>
        {%- endfor -%}
      {%- else -%}
        <!-- Static Default Blocks replicating original 4 garment cards -->
        <div class="aspect-[16/9] border border-ivory/10 relative group cursor-crosshair overflow-hidden border-grid-box">
          <img src="{{ 'front_black_1_1.png' | asset_url }}" alt="Platinum Standard" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-25 image-scale-effect">
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <h4 class="font-serif text-2xl text-ivory font-light italic">The Platinum Standard</h4>
            <p class="font-mono text-[10px] text-ivory/40 tracking-[0.2em] mt-2">SPEC // PROTOCOL_01</p>
          </div>
        </div>

        <div class="aspect-[16/9] border border-ivory/10 relative group cursor-crosshair overflow-hidden border-grid-box">
          <img src="{{ 'unisex_organic_mid_light_crafter_t_shirt_desert_dust_front_6a16dd454c251.jpg' | asset_url }}" alt="Ruby Reflections" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-25 image-scale-effect">
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <h4 class="font-serif text-2xl text-ivory font-light italic">Ruby Reflections</h4>
            <p class="font-mono text-[10px] text-ivory/40 tracking-[0.2em] mt-2">SPEC // PROTOCOL_02</p>
          </div>
        </div>

        <div class="aspect-[16/9] border border-ivory/10 relative group cursor-crosshair overflow-hidden border-grid-box">
          <img src="{{ 'unisex_columbia_soft_shell_jacket_collegiate_navy_front_6a16eba5ad374.jpg' | asset_url }}" alt="Crown Presence" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-25 image-scale-effect">
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <h4 class="font-serif text-2xl text-ivory font-light italic">Crown Presence</h4>
            <p class="font-mono text-[10px] text-ivory/40 tracking-[0.2em] mt-2">SPEC // PROTOCOL_03</p>
          </div>
        </div>

        <div class="aspect-[16/9] border border-ivory/10 relative group cursor-crosshair overflow-hidden border-grid-box">
          <img src="{{ 'unisex_organic_mid_light_crafter_t_shirt_black_back_6a16dd454caca.jpg' | asset_url }}" alt="Echoes of Gold" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-25 image-scale-effect">
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <h4 class="font-serif text-2xl text-ivory font-light italic">Echoes of Gold</h4>
            <p class="font-mono text-[10px] text-ivory/40 tracking-[0.2em] mt-2">SPEC // PROTOCOL_04</p>
          </div>
        </div>
      {%- endif -%}
    </div>
  </div>
</section>
`;

fs.writeFileSync(path.join(themeDir, 'sections', 'cinema-vault.liquid'), cinemaContent);

// 13. Generate shopify-theme/sections/visual-vault.liquid
const vaultContent = `{% schema %}
{
  "name": "Visual Vault",
  "tag": "section",
  "class": "section-visual-vault",
  "settings": [
    {
      "type": "text",
      "id": "meta_title",
      "label": "Top Category Tag",
      "default": "The Crafted Archive of World & Presence"
    },
    {
      "type": "text",
      "id": "section_title",
      "label": "Section Heading",
      "default": "Visual Vault"
    },
    {
      "type": "text",
      "id": "title_img1",
      "label": "Image 1 Title",
      "default": "The Crowned Standard"
    },
    {
      "type": "image_picker",
      "id": "image1",
      "label": "Image 1 Picker"
    },
    {
      "type": "text",
      "id": "title_img2",
      "label": "Image 2 Title",
      "default": "Crafted Silence"
    },
    {
      "type": "image_picker",
      "id": "image2",
      "label": "Image 2 Picker"
    },
    {
      "type": "text",
      "id": "title_img3",
      "label": "Image 3 Title",
      "default": "Private Command"
    },
    {
      "type": "image_picker",
      "id": "image3",
      "label": "Image 3 Picker"
    },
    {
      "type": "text",
      "id": "title_img4",
      "label": "Image 4 Title",
      "default": "Archive Presence"
    },
    {
      "type": "image_picker",
      "id": "image4",
      "label": "Image 4 Picker"
    }
  ]
}
{% endschema %}

<section id="visual-vault" class="relative w-full py-20 px-6 lg:px-24 z-10 border-t border-ivory/10 bg-transparent overflow-hidden">
  <div class="max-w-7xl mx-auto w-full relative z-10">
    <p class="font-mono text-[10px] text-ivory/40 tracking-[0.3em] uppercase mb-4">{{ section.settings.meta_title }}</p>
    <h2 class="font-serif text-5xl lg:text-7xl text-ivory font-light mb-12">
      {{ section.settings.section_title }}
    </h2>

    <div class="relative w-full pb-24">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 relative items-start">
        
        <!-- Broken Editorials Layout Matrix -->
        <div class="md:col-span-5 md:col-start-1 relative z-10">
          <div class="aspect-[3/4] border border-ivory/10 relative overflow-hidden bg-ivory/5 group">
            {%- if section.settings.image1 != blank -%}
              <img src="{{ section.settings.image1 | image_url: width: 1024 }}" alt="{{ section.settings.title_img1 | escape }}" class="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 image-scale-effect">
            {%- else -%}
              <img src="{{ 'chatgpt_image_may_28_2026_02_10_07_am_5.png' | asset_url }}" alt="Crown Standard" class="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 image-scale-effect">
            {%- endif -%}
            <div class="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-60"></div>
          </div>
          <div class="mt-6 md:-mt-12 md:pl-8 relative z-20 mix-blend-difference">
            <h4 class="font-serif text-3xl md:text-5xl text-ivory italic">{{ section.settings.title_img1 }}</h4>
            <p class="font-mono text-[10px] text-ivory/60 tracking-[0.2em] uppercase mt-2">Legacy / Artifact 01</p>
          </div>
        </div>

        <div class="md:col-span-5 md:col-start-8 mt-16 md:mt-48 relative z-0">
          <div class="aspect-[4/3] border border-ivory/10 relative overflow-hidden bg-ivory/5 group">
            {%- if section.settings.image2 != blank -%}
              <img src="{{ section.settings.image2 | image_url: width: 1024 }}" alt="{{ section.settings.title_img2 | escape }}" class="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 image-scale-effect">
            {%- else -%}
              <img src="{{ 'chatgpt_image_may_28_2026_02_10_07_am_6_1.png' | asset_url }}" alt="Crafted Silence" class="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 image-scale-effect">
            {%- endif -%}
          </div>
          <div class="mt-6">
            <h4 class="font-serif text-2xl text-ivory">{{ section.settings.title_img2 }}</h4>
            <p class="font-mono text-[10px] text-ivory/50 tracking-[0.2em] uppercase mt-1">Vision / Artifact 02</p>
          </div>
        </div>

        <div class="md:col-span-6 md:col-start-4 mt-16 md:-mt-24 relative z-20">
          <div class="aspect-[16/9] border border-ivory/10 relative overflow-hidden bg-ivory/5 group">
            {%- if section.settings.image3 != blank -%}
              <img src="{{ section.settings.image3 | image_url: width: 1024 }}" alt="{{ section.settings.title_img3 | escape }}" class="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 image-scale-effect">
            {%- else -%}
              <img src="{{ 'chatgpt_image_may_28_2026_02_10_36_am_1_1.png' | asset_url }}" alt="Private Command" class="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 image-scale-effect">
            {%- endif -%}
          </div>
          <div class="mt-6 bg-void/80 backdrop-blur-sm p-6 border border-ivory/5 -ml-4 md:-ml-8 mr-4 md:mr-0 inline-block shadow-2xl">
            <h4 class="font-serif text-2xl text-ivory font-light italic">{{ section.settings.title_img3 }}</h4>
            <p class="font-mono text-[10px] text-ivory/50 tracking-[0.2em] uppercase mt-1">Motion / Artifact 03</p>
          </div>
        </div>

        <div class="md:col-span-4 md:col-start-9 mt-16 md:mt-32 relative z-10">
          <div class="aspect-square border border-ivory/10 relative overflow-hidden bg-ivory/5 group">
            {%- if section.settings.image4 != blank -%}
              <img src="{{ section.settings.image4 | image_url: width: 1024 }}" alt="{{ section.settings.title_img4 | escape }}" class="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 image-scale-effect">
            {%- else -%}
              <img src="{{ 'chatgpt_image_may_28_2026_02_11_23_am_1.png' | asset_url }}" alt="Archive Presence" class="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 image-scale-effect">
            {%- endif -%}
          </div>
          <div class="mt-6 text-right md:pr-8 md:-mt-12 relative z-20 mix-blend-difference">
            <h4 class="font-serif text-2xl text-ivory">{{ section.settings.title_img4 }}</h4>
            <p class="font-mono text-[10px] text-ivory/50 tracking-[0.2em] uppercase mt-1">Myth / Artifact 04</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
`;

fs.writeFileSync(path.join(themeDir, 'sections', 'visual-vault.liquid'), vaultContent);

// 14. Generate shopify-theme/sections/editorial-prose.liquid
const proseContent = `{% schema %}
{
  "name": "Editorial Mythos Prose",
  "tag": "section",
  "class": "section-editorial-prose",
  "settings": [
    {
      "type": "text",
      "id": "branding_title",
      "label": "Identity Brand Name",
      "default": "TheOfficialIntelligence"
    },
    {
      "type": "header",
      "content": "Story block 1: The Splits"
    },
    {
      "type": "text",
      "id": "block1_heading",
      "label": "Block 1 Heading",
      "default": "The Creator and The Create"
    },
    {
      "type": "richtext",
      "id": "block1_content",
      "label": "Block 1 Copy",
      "default": "<p>At the center of KingShadP lives a split: The Creator // The Create. This is not just a clever phrase. It is the psychological engine of the entire world.</p><p>The Creator is the architect. He is the part of the self that chooses the name, designs the symbols, imagines the room, selects the palette, shapes the sound, and decides how the world should feel.</p><p>The Create is the result. He is what happens after the dream takes form. He is the human who must live inside the persona, experiencing the weight of being seen.</p>"
    },
    {
      "type": "header",
      "content": "Story block 2: The Rules"
    },
    {
      "type": "text",
      "id": "block2_heading",
      "label": "Block 2 Heading",
      "default": "The Ruler Code"
    },
    {
      "type": "richtext",
      "id": "block2_content",
      "label": "Block 2 Copy",
      "default": "<p>The Ruler code begins with hierarchy. Everything in the world of KingShadP needs rank. The crest carries recognition and house authority. The wordmark carries official naming.</p><p>A true Ruler does not beg. Begging energy weakens the brand faster than imperfection does. The Ruler code says: do the work, define the standard, and let recognition grow from consistency.</p>"
    },
    {
      "type": "header",
      "content": "Story block 3: The Restraints"
    },
    {
      "type": "text",
      "id": "block3_heading",
      "label": "Block 3 Heading",
      "default": "The Luxury of Silence"
    },
    {
      "type": "richtext",
      "id": "block3_content",
      "label": "Block 3 Copy",
      "default": "<p>Taste is the ability to know what not to add. The risk is not emptiness. The risk is excess without hierarchy.</p><p>The luxury of silence is that it lets the audience lean in. When everything is obvious, the audience consumes and leaves. When something is withheld, they interpret. They search. They remember.</p>"
    }
  ]
}
{% endschema %}

<section class="relative w-full py-20 px-6 lg:px-24 z-10 border-t border-ivory/10 bg-transparent overflow-hidden">
  <div class="max-w-4xl mx-auto w-full relative z-10">
    <h2 class="font-serif text-5xl lg:text-7xl text-ivory font-light mb-8 scramble-text">
      {{ section.settings.branding_title }}<span class="text-gold">.</span>
    </h2>

    <div class="font-serif text-lg md:text-xl text-ivory/80 leading-relaxed font-light space-y-6">
      <p>
        The Verse begins as a name, but the name is only the surface. Beneath it is a system of identity, taste, self-invention, contradiction, confidence, pain, performance, discipline, symbolism, and transformation.
      </p>
      <p>
        The world of KingShadP is luxurious, but luxury alone is too common. Luxury without meaning becomes costume. Power without restraint becomes noise. Confidence without emotional intelligence becomes arrogance. Mythology without truth becomes fantasy that collapses under its own decoration.
      </p>
    </div>

    <!-- Section Block 1 -->
    <div class="mt-24">
      <h3 class="font-serif text-3xl lg:text-4xl text-ivory font-light mb-6 flex items-center gap-4">
        <span class="w-8 h-[1px] bg-gold"></span>
        {{ section.settings.block1_heading }}
      </h3>
      <div class="font-serif text-base md:text-lg text-ivory/70 leading-relaxed font-light space-y-6">
        {{ section.settings.block1_content }}
      </div>
    </div>

    <!-- Section Block 2 -->
    <div class="mt-24">
      <h3 class="font-serif text-3xl lg:text-4xl text-ivory font-light mb-6 flex items-center gap-4">
        <span class="w-8 h-[1px] bg-oxblood"></span>
        {{ section.settings.block2_heading }}
      </h3>
      <div class="font-serif text-base md:text-lg text-ivory/70 leading-relaxed font-light space-y-6">
        {{ section.settings.block2_content }}
      </div>
    </div>

    <!-- Section Block 3 -->
    <div class="mt-24">
      <h3 class="font-serif text-3xl lg:text-4xl text-ivory font-light mb-6 flex items-center gap-4">
        <span class="w-8 h-[1px] bg-ivory/50"></span>
        {{ section.settings.block3_heading }}
      </h3>
      <div class="font-serif text-base md:text-lg text-ivory/70 leading-relaxed font-light space-y-6">
        {{ section.settings.block3_content }}
      </div>
    </div>

  </div>
</section>
`;

fs.writeFileSync(path.join(themeDir, 'sections', 'editorial-prose.liquid'), proseContent);

// 15. Generate shopify-theme/sections/footer.liquid
const footerContent = `{% schema %}
{
  "name": "Telemetry Footer",
  "tag": "footer",
  "class": "shopify-section-footer",
  "settings": [
    {
      "type": "text",
      "id": "copyright_text",
      "label": "Copyright Text",
      "default": "KingShadP"
    }
  ]
}
{% endschema %}

<footer class="relative w-full py-12 px-6 lg:px-24 z-10 border-t border-ivory/10 bg-transparent text-center">
  <div class="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono text-ivory/40 uppercase tracking-[0.2em]">
    <div>
      &copy; {{ 'now' | date: '%Y' }} {{ section.settings.copyright_text }} SYSTEM. ALL RIGHTS RESERVED.
    </div>
    
    <div class="flex gap-8 hover:text-gold transition-colors">
      <span class="text-oxblood">//</span> ARCHIVE PROTOCOL V9.0 ACTIVE
    </div>
  </div>
</footer>
`;

fs.writeFileSync(path.join(themeDir, 'sections', 'footer.liquid'), footerContent);

// 16. Generate templates
const indexJson = {
  "sections": {
    "hero3d": {
      "type": "hero3d-divine"
    },
    "hero": {
      "type": "divine-hero"
    },
    "verse": {
      "type": "the-verse"
    }
  },
  "order": [
    "hero3d",
    "hero",
    "verse"
  ]
};

fs.writeFileSync(path.join(themeDir, 'templates', 'index.json'), JSON.stringify(indexJson, null, 2));

// Generate settings files
const settingsSchema = [
  {
    "name": "Theme Details",
    "settings": [
      {
        "type": "image_picker",
        "id": "favicon",
        "label": "Favicon Mark"
      }
    ]
  }
];

fs.writeFileSync(path.join(themeDir, 'config', 'settings_schema.json'), JSON.stringify(settingsSchema, null, 2));

const settingsData = {
  "current": {
    "sections": {
      "header-group": {
        "type": "header-group",
        "sections": {
          "header": {
            "type": "header",
            "settings": {
              "branding": "KingShadP"
            }
          }
        },
        "order": ["header"]
      },
      "footer-group": {
        "type": "footer-group",
        "sections": {
          "footer": {
            "type": "footer-divine",
            "settings": {}
          }
        },
        "order": ["footer"]
      }
    }
  }
};

fs.writeFileSync(path.join(themeDir, 'config', 'settings_data.json'), JSON.stringify(settingsData, null, 2));

// Generate groups layout definition
const headerGroup = {
  "name": "Header Group",
  "type": "header",
  "sections": {
    "header": {
      "type": "header",
      "settings": {}
    }
  },
  "order": ["header"]
};
fs.writeFileSync(path.join(themeDir, 'sections', 'header-group.json'), JSON.stringify(headerGroup, null, 2));

const footerGroup = {
  "name": "Footer Group",
  "type": "footer",
  "sections": {
    "footer": {
      "type": "footer-divine",
      "settings": {}
    }
  },
  "order": ["footer"]
};
fs.writeFileSync(path.join(themeDir, 'sections', 'footer-group.json'), JSON.stringify(footerGroup, null, 2));

// Generate English Locale default file
const localeEn = {
  "general": {
    "accessibility": {
      "skip_to_content": "Skip to content"
    }
  }
};
fs.writeFileSync(path.join(themeDir, 'locales', 'en.default.json'), JSON.stringify(localeEn, null, 2));

const { execSync } = require('child_process');
try {
  console.log('// Packaging Shopify Theme into "divine-archive-shopify.zip"...');
  
  // Package files at the ZIP root by changing directory to themeDir during packaging.
  // Try running bestzip local script directly first helper, fallback to npx if needed.
  try {
    console.log('// Attempting local bestzip execution...');
    execSync('node ../node_modules/bestzip/bin/cli.js ../divine-archive-shopify.zip *', { cwd: themeDir });
  } catch (localErr) {
    console.log('// Local bestzip failed or was missing, falling back to npx bestzip:', localErr.message);
    execSync('npx bestzip ../divine-archive-shopify.zip *', { cwd: themeDir });
  }
  console.log('// Packaging complete. divine-archive-shopify.zip is compiled successfully at the root directory!');
} catch (err) {
  console.error('// Failed to package theme elements into zip:', err.message);
}

console.log('\\n// Shopify Theme compiled beautifully!');
console.log('// Files generated inside "shopify-theme" standard theme workspace layout successfully.');
