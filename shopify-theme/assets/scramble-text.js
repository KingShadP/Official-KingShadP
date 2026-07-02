/**
 * Divine Archive Scramble Text Decoder
 * Applies terminal decryption visual scrambles to elements with '.scramble-text' class
 */
(function() {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";

  function scrambleElement(el) {
    const originalText = el.getAttribute('data-original-text') || el.innerText;
    if (!originalText) return;
    
    // Save original to ensure we do not recursively destroy or scramble multiple times
    if (!el.getAttribute('data-original-text')) {
      el.setAttribute('data-original-text', originalText);
    }

    const duration = parseInt(el.getAttribute('data-scramble-duration')) || 1000;
    const delay = parseInt(el.getAttribute('data-scramble-delay')) || 0;

    let startTime = null;
    let animFrame = null;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < delay) {
        animFrame = requestAnimationFrame(tick);
        return;
      }

      const activeProgress = elapsed - delay;
      const revealCount = Math.floor((activeProgress / duration) * originalText.length);

      if (revealCount >= originalText.length) {
        el.innerText = originalText;
        return; // Completed
      }

      let result = "";
      for (let i = 0; i < originalText.length; i++) {
        if (i < revealCount) {
          result += originalText[i];
        } else if (originalText[i] === " " || originalText[i] === "\n") {
          result += originalText[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      el.innerText = result;
      animFrame = requestAnimationFrame(tick);
    }

    animFrame = requestAnimationFrame(tick);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Track both immediate and lazy intersecting elements to prevent CPU strain
    const elements = document.querySelectorAll('.scramble-text');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          scrambleElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
      // Store original text prior to observer interception to prevent flash
      const originalText = el.innerText;
      if (originalText) {
        el.setAttribute('data-original-text', originalText);
        // Initially set random scrambles of equal length to conceal text prior to scroll
        let scrambledPlaceholder = "";
        for (let i = 0; i < originalText.length; i++) {
          scrambledPlaceholder += originalText[i] === " " || originalText[i] === "\n" ? originalText[i] : CHARS[Math.floor(Math.random()*CHARS.length)];
        }
        el.innerText = scrambledPlaceholder;
        observer.observe(el);
      }
    });
  });
})();
