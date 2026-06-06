/**
 * Divine Archive Scroll Particle Burst System
 * Spawns dynamic kinetic shards and center flashes using IntersectionObserver
 */
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const triggerContainers = document.querySelectorAll('.scroll-particle-burst-container');

    if (triggerContainers.length === 0) return;

    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hasReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerBurst(entry.target);
          observer.unobserve(entry.target); // Trigger only once per load
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -20% 0px'
    });

    triggerContainers.forEach(container => {
      observer.observe(container);
    });

    function triggerBurst(container) {
      // Create relative burst stage wrapper inside container if empty
      const stage = document.createElement('div');
      stage.className = 'absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-visible';
      stage.style.width = '100%';
      stage.style.height = '10px';
      container.appendChild(stage);

      // 1. Spawning Shards (35 count)
      const numShards = 35;
      for (let i = 0; i < numShards; i++) {
        const shard = document.createElement('div');
        
        // Random mathematical polar expansion vectors
        const angle = (Math.PI * 2 * i) / numShards + (Math.random() * 0.25);
        const distance = 90 + Math.random() * 160;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;
        const scale = 0.3 + Math.random() * 1.3;
        const rotate = Math.random() * 360 + 180;
        const duration = 1.0 + Math.random() * 1.5;
        const delay = Math.random() * 0.15;

        // Styling
        shard.style.position = 'absolute';
        shard.style.width = '3px';
        shard.style.height = '10px';
        shard.style.background = 'linear-gradient(135deg, #FFD700 0%, #FF4500 100%)';
        shard.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
        shard.style.filter = 'drop-shadow(0 0 10px rgba(255, 69, 0, 0.8))';
        shard.style.opacity = '1';
        shard.style.transform = 'translate3d(0, 0, 0) scale(0) rotate(0deg)';
        shard.style.transition = `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;

        stage.appendChild(shard);

        // Force repaint then fire animation frame
        requestAnimationFrame(() => {
          setTimeout(() => {
            shard.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
            shard.style.opacity = '0';
          }, 30);
        });

        // Cleanup shard DOM once complete
        setTimeout(() => {
          shard.remove();
        }, (duration + delay) * 1000 + 200);
      }

      // 2. Central Fusion Flash
      const flash = document.createElement('div');
      flash.className = 'absolute w-4 h-4 bg-white rounded-full blur-[2px] opacity-100 scale-0';
      flash.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
      stage.appendChild(flash);

      requestAnimationFrame(() => {
        setTimeout(() => {
          flash.style.transform = 'scale(5)';
          flash.style.opacity = '0';
        }, 15);
      });

      // Cleanup flash DOM
      setTimeout(() => {
        flash.remove();
        stage.remove();
      }, 1000);
    }
  });
})();
