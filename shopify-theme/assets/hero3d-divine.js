/**
 * Divine Archive Hero3D WebGL Engine
 * Rebuilds the React Three Fiber Deep Space system in performant Vanilla JS / Three.js
 */
(function() {
  const container = document.getElementById('hero3d-container');
  const canvas = document.getElementById('hero3d-canvas');
  if (!container || !canvas) return;

  // Reduced motion query
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    container.classList.add('reduced-motion-fallback');
    console.log('// Hero3D: Reduced motion detected. Activating static deep-space visual fallback.');
    return;
  }

  // Check for WebGL support
  function hasWebGL() {
    try {
      return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
    } catch(e) {
      return false;
    }
  }

  if (!hasWebGL()) {
    container.classList.add('no-webgl-fallback');
    console.log('// Hero3D: WebGL not supported. Activating elegant fallback background.');
    return;
  }

  // Load Three.js safely from a robust CDN source if not loaded
  if (typeof THREE === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initEngine;
    document.head.appendChild(script);
  } else {
    initEngine();
  }

  function initEngine() {
    let renderer, scene, camera;
    let stars, magmaMesh, whiteLine, spaceship;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const count = 300;
    const initialPositions = [];
    const targetPositions = [];
    const rotations = [];

    function init() {
      // 1. Scene Setup
      scene = new THREE.Scene();
      // Cinematic dark void ambiance fog to fade assets back in distance
      scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

      // 2. Camera Setup
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 5);

      // 3. Renderer Setup
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      // 4. Lighting Setup
      const ambientLight = new THREE.AmbientLight(0x111111, 0.2);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xf4f1eb, 1.2);
      dirLight1.position.set(10, 10, 5);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x93000a, 0.8);
      dirLight2.position.set(-10, -10, -5);
      scene.add(dirLight2);

      // 5. Starfield background particle generation
      const starGeometry = new THREE.BufferGeometry();
      const starColors = [];
      const starPositions = [];
      const numStars = 2500;

      for (let i = 0; i < numStars; i++) {
        starPositions.push(
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200
        );
        
        // Asymmetric cinematic star color spectrum
        const r = Math.random();
        if (r > 0.90) { // Gold stars
          starColors.push(0.86, 0.77, 0.48);
        } else if (r > 0.82) { // Crimson stars
          starColors.push(0.57, 0.0, 0.04);
        } else { // Pure white/ivory stars
          starColors.push(0.95, 0.94, 0.92);
        }
      }

      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

      // Delicate soft particle representation
      const starMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });

      stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // 6. Instanced Magma Shards (300 entities)
      const magmaGeometry = new THREE.TetrahedronGeometry(0.15, 0);
      const magmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        emissive: 0xFF4500,
        emissiveIntensity: 1.2,
        metalness: 0.5,
        roughness: 0.1
      });

      magmaMesh = new THREE.InstancedMesh(magmaGeometry, magmaMaterial, count);
      
      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const radius = Math.random() * 1.5;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        const pos0 = new THREE.Vector3(x, y, z);
        initialPositions.push(pos0);

        const targetRadius = 15 + Math.random() * 20;
        const pos1 = new THREE.Vector3(
          (radius > 0 ? (x / radius) : 0) * targetRadius,
          (radius > 0 ? (y / radius) : 0) * targetRadius,
          (radius > 0 ? (z / radius) : 0) * targetRadius
        );
        targetPositions.push(pos1);

        const euler = new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        rotations.push(euler);

        dummy.position.copy(pos0);
        dummy.rotation.copy(euler);
        dummy.updateMatrix();
        magmaMesh.setMatrixAt(i, dummy.matrix);
      }
      scene.add(magmaMesh);

      // 7. White Trajectory Line
      const pathGeometry = new THREE.CylinderGeometry(0.015, 0.015, 200, 8);
      const pathMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      whiteLine = new THREE.Mesh(pathGeometry, pathMaterial);
      whiteLine.position.set(0, -1, -50);
       whiteLine.rotation.set(Math.PI / 2, 0, 0);
      scene.add(whiteLine);

      // 8. Spaceship Primitives Group
      spaceship = new THREE.Group();
      
      // Conical nose
      const noseGeo = new THREE.ConeGeometry(0.4, 2, 4);
      const noseMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.1
      });
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.position.set(0, 0, 0);
      nose.rotation.set(Math.PI / 2, 0, 0);
      spaceship.add(nose);

      // Wing structure
      const wingGeo = new THREE.BoxGeometry(1.6, 0.1, 0.8);
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 1.0,
        roughness: 0.2
      });
      const wings = new THREE.Mesh(wingGeo, wingMat);
      wings.position.set(0, 0, 0.6);
      spaceship.add(wings);

      // Thruster engine flare
      const flareGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const flareMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff
      });
      const flare = new THREE.Mesh(flareGeo, flareMat);
      flare.position.set(0, 0, 1.0);
      spaceship.add(flare);

      spaceship.position.set(2, 0, 10);
      spaceship.rotation.set(0, Math.PI, 0);
      scene.add(spaceship);

      // Start loop
      tick();
    }

    // Scroll interpolation tracking
    let scrollVal = 0;
    window.addEventListener('scroll', () => {
      const top = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollVal = docHeight > 0 ? (top / docHeight) : 0;
    }, { passive: true });

    const dummyObj = new THREE.Object3D();
    const clock = new THREE.Clock();

    function tick() {
      requestAnimationFrame(tick);
      
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Lerping system mechanics
      const r1 = scrollVal; // Normalized scroll progress

      // A) Camera Rig positioning
      const targetCamZ = 2 - r1 * 25;
      const targetCamY = r1 * 1.5;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.lookAt(0, 0, -20);

      // B) Star background vector drift acceleration
      stars.rotation.y = time * 0.015 + r1 * 0.5;
      stars.rotation.z = time * 0.005;

      // C) Instanced Magma Shards explosion burst
      // Starting from scroll 0.05 up to 0.5
      let progress = Math.max(0, Math.min(1, (r1 - 0.05) / 0.45));
      // Ease-out cubic curve
      progress = 1 - Math.pow(1 - progress, 3);

      for (let i = 0; i < count; i++) {
        const p0 = initialPositions[i];
        const p1 = targetPositions[i];

        dummyObj.position.lerpVectors(p0, p1, progress);

        // Constant rotational drift augmented by scroll kinetic momentum
        dummyObj.rotation.x = rotations[i].x + time * 0.5 + r1 * 8;
        dummyObj.rotation.y = rotations[i].y + time * 0.5 + r1 * 8;
        dummyObj.rotation.z = rotations[i].z + time * 0.5 + r1 * 8;

        dummyObj.updateMatrix();
        magmaMesh.setMatrixAt(i, dummyObj.matrix);
      }
      magmaMesh.instanceMatrix.needsUpdate = true;

      // D) Dynamic Spaceship orbit trajectory
      const spaceTargetZ = (10 - r1 * 110);
      spaceship.position.z += (spaceTargetZ - spaceship.position.z) * 0.08;
      spaceship.position.x = Math.sin(r1 * Math.PI * 3) * 1.8;
      spaceship.rotation.z = Math.sin(r1 * Math.PI * 8) * 0.25;

      renderer.render(scene, camera);
    }

    // Viewport Resize Handler
    window.addEventListener('resize', () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    init();
  }
})();
