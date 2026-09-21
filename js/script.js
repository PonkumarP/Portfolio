/* ==========================================
   PORTFOLIO — MAIN SCRIPT
   Advanced Cursor + All existing features
   ========================================== */

'use strict';

// ── DOM Ready ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();       // ← advanced cursor (runs first)
  initLoader();
  initParticles();
  initNavbar();
  initThemeToggle();
  initTypewriter();
  initScrollAnimations();
  initSkillBars();
  initCounterStats();
  initSkillFilter();
  initProjectFilter();
  initTestimonialSlider();
  initContactForm();
  initBackToTop();
  initFooterYear();
});

/* ══════════════════════════════════════════
   1. ADVANCED CURSOR ENGINE
   Features:
   • Dot   — snaps instantly to pointer (rAF)
   • Ring  — lerp-follows with spring lag
   • Trail — fading ghost dots every 40ms
   • Burst — particle explosion on click
   • Morph — different shape per element type
   • Magnetic — buttons & icons pull the ring
══════════════════════════════════════════ */
function initCursor() {
  // Skip on touch-only devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot       = document.getElementById('cursor-dot');
  const ring      = document.getElementById('cursor-ring');
  const body      = document.body;
  if (!dot || !ring) return;

  // ── Coordinates ──
  let mouseX = -200, mouseY = -200;  // real pointer
  let ringX  = -200, ringY  = -200;  // lagged ring
  let dotX   = -200, dotY   = -200;  // snappy dot

  // Magnetic target (set when near a magnetic element)
  let magX = null, magY = null;

  // ── rAF loop ──
  function raf() {
    // Dot: snap with very slight ease
    dotX += (mouseX - dotX) * 0.85;
    dotY += (mouseY - dotY) * 0.85;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%,-50%)`;

    // Ring: spring-follow toward magnetic target if near, else mouse
    const targetX = magX !== null ? magX : mouseX;
    const targetY = magY !== null ? magY : mouseY;
    ringX += (targetX - ringX) * 0.14;
    ringY += (targetY - ringY) * 0.14;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;

    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ── Mouse move ──
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    body.classList.remove('cursor-out');
    spawnTrail(e.clientX, e.clientY);
  }, { passive: true });

  // ── Mouse leave / enter window ──
  document.addEventListener('mouseleave', () => body.classList.add('cursor-out'));
  document.addEventListener('mouseenter', () => body.classList.remove('cursor-out'));

  // ── Click burst ──
  document.addEventListener('mousedown', (e) => {
    body.classList.add('cursor-click');
    spawnBurst(e.clientX, e.clientY);
  });
  document.addEventListener('mouseup', () => {
    body.classList.remove('cursor-click');
  });

  // ── Element type detection for cursor morphing ──
  const LINK_SEL  = 'a, button, [role="button"], .btn, label, .nav-link, .social-link, .proj-link, .back-to-top, .testi-btn, .skill-filter, .proj-filter';
  const CARD_SEL  = '.skill-card, .project-card, .cert-card, .achievement-card, .stat-card, .edu-card, .coding-profile-card, .timeline-content';
  const IMG_SEL   = 'img, .hero-avatar, .about-img, .avatar-img, .avatar-placeholder';
  const TEXT_SEL  = 'p, li, span:not(.badge-dot), h1, h2, h3, h4';

  // Magnetic elements: the ring gets pulled toward center
  const MAG_SEL = '.btn, .social-link, .nav-logo, .back-to-top, .theme-toggle';

  function setCursorState(state) {
    body.classList.remove('cursor-hover', 'cursor-card', 'cursor-text', 'cursor-img');
    if (state) body.classList.add(state);
  }

  function attachHoverListeners(selector, state, magnetic = false) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        setCursorState(state);
        if (magnetic) updateMagnet(el);
      });
      el.addEventListener('mousemove', (e) => {
        if (magnetic) updateMagnet(el, e);
      });
      el.addEventListener('mouseleave', () => {
        setCursorState(null);
        if (magnetic) { magX = null; magY = null; }
      });
    });
  }

  // Order matters — most specific first
  attachHoverListeners(IMG_SEL,   'cursor-img');
  attachHoverListeners(CARD_SEL,  'cursor-card');
  attachHoverListeners(TEXT_SEL,  'cursor-text');
  attachHoverListeners(LINK_SEL,  'cursor-hover', true);

  // ── Magnetic logic ──
  // The ring is pulled toward element center with proportional offset
  function updateMagnet(el, e) {
    const rect  = el.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;

    if (e) {
      // Pull strength: 0.35 — ring goes 35% of the way from mouse to center
      const strength = 0.38;
      magX = mouseX + (cx - mouseX) * strength;
      magY = mouseY + (cy - mouseY) * strength;
    } else {
      magX = cx;
      magY = cy;
    }
  }

  // ── Trail system ──
  const TRAIL_COUNT  = 12;
  const TRAIL_GAP_MS = 35;
  let lastTrailTime  = 0;
  const trailColors  = [
    'rgba(99,102,241,0.5)',
    'rgba(139,92,246,0.45)',
    'rgba(6,182,212,0.4)',
    'rgba(99,102,241,0.3)',
    'rgba(6,182,212,0.25)',
  ];
  let trailIndex = 0;

  function spawnTrail(x, y) {
    const now = performance.now();
    if (now - lastTrailTime < TRAIL_GAP_MS) return;
    lastTrailTime = now;

    const el = document.createElement('div');
    el.className = 'cursor-trail';
    const size = Math.random() * 8 + 4;
    el.style.cssText = `
      left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
      background: ${trailColors[trailIndex % trailColors.length]};
      box-shadow: 0 0 ${size * 2}px ${trailColors[trailIndex % trailColors.length]};
    `;
    trailIndex++;

    document.getElementById('cursor-trail-container')?.appendChild(el);
    // Remove after animation ends
    el.addEventListener('animationend', () => el.remove());
  }

  // ── Click burst ──
  const BURST_COUNT  = 10;
  const burstColors  = ['#6366F1','#8B5CF6','#06B6D4','#a78bfa','#67e8f9','#ffffff'];

  function spawnBurst(x, y) {
    for (let i = 0; i < BURST_COUNT; i++) {
      const el    = document.createElement('div');
      el.className = 'cursor-burst';
      const size  = Math.random() * 10 + 4;
      const angle = (Math.PI * 2 / BURST_COUNT) * i + Math.random() * 0.4;
      const dist  = Math.random() * 60 + 30;
      const bx    = `${Math.cos(angle) * dist - 50}%`;
      const by    = `${Math.sin(angle) * dist - 50}%`;
      const color = burstColors[Math.floor(Math.random() * burstColors.length)];

      el.style.cssText = `
        left: ${x}px; top: ${y}px;
        width: ${size}px; height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        --bx: calc(${Math.cos(angle) * dist}px - 50%);
        --by: calc(${Math.sin(angle) * dist}px - 50%);
        animation-delay: ${i * 18}ms;
      `;

      document.getElementById('cursor-trail-container')?.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  // ── Re-attach on DOM changes (for dynamically shown elements) ──
  const mo = new MutationObserver(() => {
    attachHoverListeners(LINK_SEL, 'cursor-hover', true);
    attachHoverListeners(CARD_SEL, 'cursor-card');
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* ══════════════════════════════════════════
   2. LOADER
══════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2400);
  document.body.style.overflow = 'hidden';
}

/* ══════════════════════════════════════════
   3. PARTICLE BACKGROUND
══════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const NUM = 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const isDark = () => document.body.classList.contains('dark-mode');

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark()
        ? `rgba(99,102,241,${this.a})`
        : `rgba(99,102,241,${this.a * 0.5})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const opacity = (1 - dist / 110) * (isDark() ? 0.15 : 0.07);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ══════════════════════════════════════════
   4. NAVBAR
══════════════════════════════════════════ */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const navList = document.getElementById('nav-links');
  const links   = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
    showBackToTop();
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle?.setAttribute('aria-expanded', false);
      const spans = toggle?.querySelectorAll('span');
      spans?.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = section.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  updateActiveLink();
}

/* ══════════════════════════════════════════
   5. THEME TOGGLE
══════════════════════════════════════════ */
function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const body = document.getElementById('body');
  if (!btn) return;

  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-mode');
    applyTheme(isDark ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      icon.className = 'fas fa-sun';
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      icon.className = 'fas fa-moon';
    }
    localStorage.setItem('portfolio-theme', theme);
  }
}

/* ══════════════════════════════════════════
   6. TYPEWRITER
══════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const strings = [
    'Final-Year Engineering Student',
    'Aspiring Software Engineer',
    'AI/ML Enthusiast',
    'Full Stack Developer',
    'Problem Solver',
    'Open Source Contributor'
  ];

  let strIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const current = strings[strIndex];
    el.textContent = isDeleting
      ? current.slice(0, --charIndex)
      : current.slice(0, ++charIndex);

    let delay = isDeleting ? 50 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      strIndex = (strIndex + 1) % strings.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();
}

/* ══════════════════════════════════════════
   7. SCROLL ANIMATIONS
══════════════════════════════════════════ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach((el, i) => {
    if (el.closest('.skills-grid, .projects-grid, .cert-grid, .achievements-grid')) {
      el.dataset.delay = (i % 4) * 80;
    }
    observer.observe(el);
  });
}

/* ══════════════════════════════════════════
   8. SKILL BARS
══════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-progress');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => { bar.style.width = (bar.dataset.width || 0) + '%'; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(bar => observer.observe(bar));
}

/* ══════════════════════════════════════════
   9. COUNTER STATS
══════════════════════════════════════════ */
function initCounterStats() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const step   = target / (1800 / 16);
    let current  = 0;
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + (target >= 100 ? '+' : '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + (current >= 10 ? '+' : '');
      }
    }, 16);
  }
}

/* ══════════════════════════════════════════
   10. SKILL FILTER
══════════════════════════════════════════ */
function initSkillFilter() {
  const buttons = document.querySelectorAll('.skill-filter');
  const cards   = document.querySelectorAll('.skill-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) card.style.animation = 'fadeIn 0.35s ease forwards';
      });
    });
  });
}

/* ══════════════════════════════════════════
   11. PROJECT FILTER
══════════════════════════════════════════ */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.proj-filter');
  const cards   = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tech = btn.dataset.tech;
      cards.forEach(card => {
        const techs = card.dataset.tech || '';
        const show  = tech === 'all' || techs.includes(tech);
        if (show) { card.classList.remove('hidden'); card.style.animation = 'fadeIn 0.4s ease forwards'; }
        else card.classList.add('hidden');
      });
    });
  });
}

// fadeIn keyframe
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }';
document.head.appendChild(style);

/* ══════════════════════════════════════════
   12. TESTIMONIAL SLIDER
══════════════════════════════════════════ */
function initTestimonialSlider() {
  const track   = document.getElementById('testimonialsTrack');
  const dotsEl  = document.getElementById('testiDots');
  const prevBtn = document.getElementById('prevTesti');
  const nextBtn = document.getElementById('nextTesti');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0, autoTimer;

  const getVisible = () => window.innerWidth < 768 ? 1 : 2;

  function createDots() {
    dotsEl.innerHTML = '';
    const count = Math.ceil(cards.length / getVisible());
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function goTo(index) {
    const visible  = getVisible();
    const maxIndex = Math.ceil(cards.length / visible) - 1;
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth * visible}px)`;
    dotsEl.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn?.addEventListener('click', () => { resetAuto(); goTo(current - 1); });
  nextBtn?.addEventListener('click', () => { resetAuto(); goTo(current + 1); });

  function startAuto() {
    autoTimer = setInterval(() => {
      const maxIndex = Math.ceil(cards.length / getVisible()) - 1;
      goTo(current < maxIndex ? current + 1 : 0);
    }, 5000);
  }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  createDots();
  startAuto();
  window.addEventListener('resize', () => { createDots(); goTo(0); });
}

/* ══════════════════════════════════════════
   13. CONTACT FORM  —  EmailJS integration
   Setup once at https://emailjs.com :
     1. Create account → Add Email Service (Gmail)
     2. Create Email Template with variables:
        {{from_name}}, {{reply_to}}, {{subject}}, {{message}}
     3. Set "To Email" in template to ponkumarp143@gmail.com
     4. Replace the three IDs below with your own values
══════════════════════════════════════════ */
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formErrorMsg');
  if (!form) return;

  // ── EmailJS credentials ────────────────────────────────────────
  const EMAILJS_PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY';   // e.g. "abc123XYZ"
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';           // e.g. "service_xxxxxx"
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';          // e.g. "template_xxxxxx"
  // ────────────────────────────────────────────────────────────────

  // Initialise EmailJS once
  if (window.emailjs) emailjs.init(EMAILJS_PUBLIC_KEY);

  const nameInput  = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const msgInput   = document.getElementById('message');

  nameInput?.addEventListener('input',  validateName);
  emailInput?.addEventListener('input', validateEmail);
  msgInput?.addEventListener('input',   validateMessage);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateName() || !validateEmail() || !validateMessage()) return;

    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    successMsg.style.display = 'none';
    errorMsg.style.display   = 'none';

    try {
      // ── Build WhatsApp message ──────────────────────────────────
      const name    = nameInput.value.trim();
      const email   = emailInput.value.trim();
      const subject = document.getElementById('subject')?.value.trim() || '(No subject)';
      const message = msgInput.value.trim();

      const waText = encodeURIComponent(
        `📩 *New Portfolio Message*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📧 *Email:* ${email}\n` +
        `📌 *Subject:* ${subject}\n\n` +
        `💬 *Message:*\n${message}`
      );

      // Your WhatsApp number in international format (no + sign)
      const WHATSAPP_NUMBER = '919342189432';
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, '_blank');

      successMsg.style.display = 'flex';
      form.reset();
      clearErrors();
      setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
      // ─────────────────────────────────────────────────────────────
    } catch (err) {
      console.error('Send error:', err);
      errorMsg.style.display = 'flex';
      setTimeout(() => { errorMsg.style.display = 'none'; }, 8000);
    } finally {
      btnText.style.display    = '';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }
  });

  function validateName() {
    const val = nameInput?.value.trim() || '';
    const err = document.getElementById('nameError');
    if (!val) { showError(err, 'Name is required.'); return false; }
    if (val.length < 2) { showError(err, 'Min 2 characters.'); return false; }
    clearError(err); return true;
  }
  function validateEmail() {
    const val = emailInput?.value.trim() || '';
    const err = document.getElementById('emailError');
    if (!val) { showError(err, 'Email is required.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(err, 'Enter a valid email.'); return false; }
    clearError(err); return true;
  }
  function validateMessage() {
    const val = msgInput?.value.trim() || '';
    const err = document.getElementById('messageError');
    if (!val) { showError(err, 'Message is required.'); return false; }
    if (val.length < 10) { showError(err, 'Min 10 characters.'); return false; }
    clearError(err); return true;
  }
  function showError(el, msg) {
    if (el) { el.textContent = msg; el.closest('.form-group')?.querySelector('.form-input')?.classList.add('error'); }
  }
  function clearError(el) {
    if (el) { el.textContent = ''; el.closest('.form-group')?.querySelector('.form-input')?.classList.remove('error'); }
  }
  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
  }
}

const errStyle = document.createElement('style');
errStyle.textContent = '.form-input.error { border-color: #f87171 !important; }';
document.head.appendChild(errStyle);

/* ══════════════════════════════════════════
   14. BACK TO TOP
══════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
function showBackToTop() {
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}

/* ══════════════════════════════════════════
   15. FOOTER YEAR
══════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════
   16. SMOOTH SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 20, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════════
   17. SECTION FADE-IN ON SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('.section').forEach(s => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) s.style.opacity = '1';
  }, { threshold: 0.05 }).observe(s);
});
