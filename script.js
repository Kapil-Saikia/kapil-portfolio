/* ============================================================
   Futuristic Portfolio — script.js
   Three.js hero orb  +  GSAP ScrollTrigger  +  interactions
   ============================================================ */

/* ── THREE.JS HERO ──────────────────────────────────────── */
function initHero3D() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  camera.position.z = 5;

  /* --- Particles ----------------------------------------- */
  const COUNT = 1800;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);

  const cyan   = new THREE.Color('#00d4ff');
  const purple = new THREE.Color('#a855f7');
  const pink   = new THREE.Color('#ec4899');

  for (let i = 0; i < COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 2.2 + Math.random() * 1.8;

    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const t = Math.random();
    const c = t < 0.45 ? cyan : t < 0.72 ? purple : pink;
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  ptGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const ptMat = new THREE.PointsMaterial({
    size: 0.022,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(ptGeo, ptMat);
  scene.add(particles);

  /* --- Wireframe orbs ------------------------------------ */
  function makeOrb(radius, segs, color, opacity) {
    const geo = new THREE.SphereGeometry(radius, segs, segs);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, wireframe: true });
    return new THREE.Mesh(geo, mat);
  }

  const orbOuter = makeOrb(0.58, 28, 0x00d4ff, 0.12);
  const orbInner = makeOrb(0.32, 16, 0xa855f7, 0.22);
  scene.add(orbOuter);
  scene.add(orbInner);

  /* --- Ring -------------------------------------------- */
  const ringGeo = new THREE.TorusGeometry(0.9, 0.008, 6, 80);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.18 });
  const ring    = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = 1.2;
  scene.add(ring);

  /* --- Mouse tracking ------------------------------------ */
  let mx = 0, my = 0, tx = 0, ty = 0;

  window.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* --- Animation loop ------------------------------------ */
  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    tx += (mx - tx) * 0.04;
    ty += (my - ty) * 0.04;

    particles.rotation.y = t * 0.04 + tx * 0.28;
    particles.rotation.x = t * 0.025 + ty * 0.28;

    orbOuter.rotation.y = t * 0.18;
    orbOuter.rotation.x = t * 0.09;
    orbInner.rotation.y = -t * 0.26;
    orbInner.rotation.z =  t * 0.18;
    ring.rotation.z     =  t * 0.12;

    renderer.render(scene, camera);
  })();

  /* --- Resize -------------------------------------------- */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ── CURSOR GLOW ─────────────────────────────────────────── */
function initCursorGlow() {
  const el = document.getElementById('cursorGlow');
  if (!el) return;

  /* Hide on touch devices */
  if (window.matchMedia('(pointer: coarse)').matches) {
    el.style.display = 'none';
    return;
  }

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  (function moveCursor() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    requestAnimationFrame(moveCursor);
  })();
}

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
function initMagneticButtons() {
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      gsap.to(btn, { x: x * 0.28, y: y * 0.28, duration: 0.3, ease: 'power2.out' });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ── HERO ENTRANCE ANIMATION ─────────────────────────────── */
function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ delay: 0.15 });

  tl.fromTo('.hero-badge',
    { opacity: 0, y: -18 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })

    .fromTo('.name-line',
    { opacity: 0, y: 55 },
    { opacity: 1, y: 0, duration: 0.85, stagger: 0.16, ease: 'power3.out' },
    '-=0.2')

    .fromTo('.hero-tagline',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    '-=0.35')

    .fromTo('.hero-cta',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    '-=0.3')

    .fromTo('.hero-scroll-indicator',
    { opacity: 0 },
    { opacity: 1, duration: 0.8 },
    '-=0.1');
}

/* ── SCROLL ANIMATIONS (GSAP ScrollTrigger) ──────────────── */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* Bento tiles */
  document.querySelectorAll('.bento-tile').forEach((tile, i) => {
    gsap.fromTo(tile,
      { opacity: 0, y: 48 },
      {
        opacity: 1, y: 0,
        duration: 0.75,
        delay: (i % 2) * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tile,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });
  });

  /* Project cards */
  document.querySelectorAll('.project-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 38, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        delay: (i % 3) * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
  });

  /* Achievement items */
  document.querySelectorAll('.achievement-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -22 },
      {
        opacity: 1, x: 0,
        duration: 0.5,
        delay: i * 0.09,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 91%',
          toggleActions: 'play none none reverse',
        },
      });
  });

  /* Timeline items */
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: 28 },
      {
        opacity: 1, x: 0,
        duration: 0.6,
        delay: i * 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
  });

  /* Skill categories */
  document.querySelectorAll('.skill-category').forEach((cat, i) => {
    gsap.fromTo(cat,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.5,
        delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cat,
          start: 'top 91%',
          toggleActions: 'play none none reverse',
        },
      });
  });

  /* About stats counter */
  document.querySelectorAll('.stat-num').forEach((el) => {
    const raw    = el.textContent.replace(/\D/g, '');
    const suffix = el.textContent.replace(/\d/g, '');
    const end    = parseInt(raw, 10);
    if (isNaN(end)) return;

    gsap.fromTo({ val: 0 },
      { val: end },
      {
        val: end,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(this.targets()[0].val) + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
  });
}

/* ── NAVBAR SCROLL EFFECT ────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('topNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ── SMOOTH SCROLL NAV ───────────────────────────────────── */
function initSmoothScrollNav() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });

      /* Close mobile nav */
      const mob = document.getElementById('mobileNav');
      if (mob) mob.classList.remove('open');
    });
  });
}

/* ── HAMBURGER MENU ──────────────────────────────────────── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => nav.classList.toggle('open'));

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
    }
  });
}

/* ── CONTACT FORM ────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    btn.innerHTML  = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    btn.disabled   = true;

    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled  = false;
      form.reset();
    }, 3200);
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initCursorGlow();
  initHeroAnimation();
  initMagneticButtons();
  initScrollAnimations();
  initNavScroll();
  initSmoothScrollNav();
  initHamburger();
  initContactForm();
});
