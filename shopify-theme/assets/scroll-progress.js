/**
 * Divine Archive Scroll Progress indicator
 */
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    // Generate markup dynamically if not in template to be super self-contained
    let bar = document.getElementById('divine-scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'divine-scroll-progress';
      bar.className = 'fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-oxblood z-[100] origin-left will-change-transform';
      bar.style.transform = 'scaleX(0)';
      bar.style.transformOrigin = 'left';
      bar.style.pointerEvents = 'none';
      document.body.appendChild(bar);
    }

    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hasReducedMotion) return;

    window.addEventListener('scroll', () => {
      const top = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (top / docHeight) : 0;
      
      // Update element scale
      bar.style.transform = `scaleX(${progress})`;
    }, { passive: true });
  });
})();
