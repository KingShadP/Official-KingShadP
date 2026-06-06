/**
 * Shopify Menu Overlay Drawer interaction handler
 * Focuses on Accessibility (WCAG 2.1), Focus Traps, and Keyboard navigation.
 */
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('shopify-menu-trigger');
    const overlay = document.getElementById('shopify-menu-overlay');
    const closeBtn = document.getElementById('shopify-menu-close');
    const branding = document.getElementById('menu-overlay-branding');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (!overlay) return;

    // Open Drawer Helper
    const openMenu = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      overlay.showModal();
      document.body.style.overflow = 'hidden';
      
      // Auto-focus on the close button to initiate logical navigation order
      setTimeout(() => {
        if (closeBtn) closeBtn.focus();
      }, 50);
    };

    // Close Drawer Helper
    const closeMenu = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      overlay.close();
      document.body.style.overflow = '';
      
      // Restore focus to original triggering element
      if (trigger) trigger.focus();
    };

    // Attach Dialog UI Triggers
    if (trigger) {
      trigger.addEventListener('click', openMenu);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }
    if (branding) {
      branding.addEventListener('click', closeMenu);
      branding.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          closeMenu(e);
        }
      });
    }

    // Clicking menu options scrolls content and collapses navigation view
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Simple delay before closing to let anchor link jump cleanly
        setTimeout(() => {
          closeMenu();
        }, 150);
      });
    });

    // Close on dialog cancel trigger (e.g., standard Escape stroke)
    overlay.addEventListener('cancel', (e) => {
      document.body.style.overflow = '';
      if (trigger) {
        setTimeout(() => trigger.focus(), 10);
      }
    });

    // Focus Trap setup inside Drawer
    overlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const focusableEls = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) { // Back tab
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else { // Forward tab
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    });

    // Manage language selection states
    const langButtons = overlay.querySelectorAll('.languages-selector button');
    langButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        langButtons.forEach(b => {
          b.setAttribute('aria-pressed', 'false');
          b.className = "min-w-[44px] min-h-[44px] flex items-center justify-center font-mono text-xs tracking-widest text-ivory/50 hover:text-ivory bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-gold cursor-crosshair";
        });
        
        btn.setAttribute('aria-pressed', 'true');
        btn.className = "min-w-[44px] min-h-[44px] flex items-center justify-center font-mono text-xs tracking-widest text-gold border-b border-gold bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-gold cursor-crosshair";
        
        const selectedLang = btn.getAttribute('data-lang');
        console.log(`// Language switched to: ${selectedLang}`);
      });
    });

  });
})();
