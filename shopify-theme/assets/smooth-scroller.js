/**
 * Divine Archive Cinematic Smooth Scroll Controller
 * Uses Studio Freight Lenis via client-safe CDN injection
 */
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.documentElement.style.scrollBehavior = 'smooth';
    console.log('// SmoothScroller: Reduced motion checked. Defaulting to standard root smooth scroll.');
    return;
  }

  // Inject Lenis script dynamically
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
  script.onload = () => {
    if (typeof Lenis === 'undefined') return;

    // Initialize smooth scroll engine
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Custom tick handler
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync scroll with window native handles
    window.addEventListener('unload', () => {
      lenis.destroy();
    });

    console.log('// SmoothScroller: Studio Freight Lenis active & synced with global animation ticks.');

    // Expose lenis instance globally for potential sectional scroll locks (e.g., custom models)
    window.divineLenis = lenis;
  };

  document.head.appendChild(script);
})();
