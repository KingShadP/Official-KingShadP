(function() {
  // 1. UTC Micro Ticker Display
  const clockEl = document.querySelector('.nav-system-clock');
  if (clockEl) {
    setInterval(() => {
      const d = new Date();
      const h = d.getUTCHours().toString().padStart(2, '0');
      const m = d.getUTCMinutes().toString().padStart(2, '0');
      const s = d.getUTCSeconds().toString().padStart(2, '0');
      const ms = d.getUTCMilliseconds().toString().padStart(3, '0');
      clockEl.innerHTML = `${h}:${m}:${s}.${ms} <span class="text-oxblood font-mono">UTC</span>`;
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
        
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        
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
        ring.style.left = `${rX}px`;
        ring.style.top = `${rY}px`;
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
