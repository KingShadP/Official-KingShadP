(function() {
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
