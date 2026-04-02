/* ============================================================
   M3 Brand Site — main.js
   Dependencies: GSAP 3.12, ScrollTrigger 3.12, Lenis 1.0.42
   ============================================================ */

'use strict';

/* Register plugin FIRST — before any ScrollTrigger reference */
gsap.registerPlugin(ScrollTrigger);

/* ---------- Lenis smooth scroll ---------- */
const lenis = new Lenis({
  duration:    1.25,
  easing:      t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothTouch: false,
});

/* Connect Lenis to GSAP ticker */
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* Keep ScrollTrigger in sync with Lenis — arrow fn preserves correct `this` */
lenis.on('scroll', () => ScrollTrigger.update());

/* ---------- Device check (evaluated once at load) ---------- */
const isDesktop = window.matchMedia('(min-width: 769px)').matches;

/* ============================================================
   TEXT SPLITTING UTILITY
   Wraps each character in a <span class="char"> for stagger animation.
   Sets aria-label on the parent to preserve accessibility.
   ============================================================ */
function splitToChars(el) {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);
  return [...text].map(char => {
    const span = document.createElement('span');
    span.className = 'char';
    span.setAttribute('aria-hidden', 'true');
    span.style.display = 'inline-block';
    span.textContent = char === ' ' ? '\u00A0' : char;
    el.appendChild(span);
    return span;
  });
}

/* ============================================================
   HERO — entrance animations (page load)
   ============================================================ */
const heroLines = document.querySelectorAll('.hero-line');
const heroTl = gsap.timeline({ delay: 0.3 });

/* Eyebrow fade-up */
heroTl.from('.hero-eyebrow', {
  opacity:  0,
  y:        22,
  duration: 1.1,
  ease:     'power3.out',
});

if (isDesktop) {
  /* Desktop: character-by-character cascade */
  const allChars = [];
  heroLines.forEach(line => allChars.push(...splitToChars(line)));

  heroTl.from(allChars, {
    opacity:  0,
    y:        44,
    duration: 0.72,
    stagger:  0.032,
    ease:     'power3.out',
  }, '-=0.6');
} else {
  /* Mobile: lighter line-by-line fade (avoids 19× DOM nodes animating) */
  heroTl.from(heroLines, {
    opacity:  0,
    y:        28,
    duration: 1.0,
    stagger:  0.18,
    ease:     'power3.out',
  }, '-=0.6');
}

heroTl.from('.scroll-indicator', {
  opacity:  0,
  y:        12,
  duration: 0.9,
  ease:     'power3.out',
}, '-=0.4');

/* ============================================================
   HERO — parallax on background
   ============================================================ */
gsap.to('.hero-bg', {
  yPercent: 22,
  ease:     'none',
  scrollTrigger: {
    trigger: '#hero',
    start:   'top top',
    end:     'bottom top',
    scrub:   true,
  },
});

/* ============================================================
   INTELLIGENT LOGO SYSTEM
   — Switch logo & nav style based on section data-theme
   ============================================================ */
const nav = document.getElementById('nav');

/* Scrolled state (nav background) */
ScrollTrigger.create({
  start: 'top -10',
  onUpdate(self) {
    nav.classList.toggle('is-scrolled', self.scroll() > 10);
  },
});

/* Per-section theme watcher */
function applyNavTheme(theme) {
  if (theme === 'light') nav.classList.add('nav-light');
  else                   nav.classList.remove('nav-light');
}

document.querySelectorAll('[data-theme]').forEach(section => {
  ScrollTrigger.create({
    trigger:     section,
    start:       `top ${nav.offsetHeight}px`,
    end:         `bottom ${nav.offsetHeight}px`,
    onEnter:     () => applyNavTheme(section.dataset.theme),
    onEnterBack: () => applyNavTheme(section.dataset.theme),
  });
});

/* ============================================================
   SCROLL REVEAL HELPERS
   ============================================================ */
function revealFadeUp(selector, opts = {}) {
  gsap.utils.toArray(selector).forEach((el, i) => {
    gsap.from(el, {
      opacity:  0,
      y:        opts.y ?? 32,
      duration: opts.duration ?? 1.0,
      delay:    opts.stagger ? i * opts.stagger : (opts.delay ?? 0),
      ease:     opts.ease ?? 'power3.out',
      scrollTrigger: {
        trigger: el,
        start:   opts.start ?? 'top 84%',
        once:    true,
      },
    });
  });
}

function revealFadeLeft(selector, opts = {}) {
  gsap.utils.toArray(selector).forEach((el, i) => {
    gsap.from(el, {
      opacity:  0,
      x:        -(opts.x ?? 24),
      duration: opts.duration ?? 0.8,
      delay:    opts.stagger ? i * opts.stagger : 0,
      ease:     opts.ease ?? 'power3.out',
      scrollTrigger: {
        trigger: el,
        start:   'top 86%',
        once:    true,
      },
    });
  });
}

/* ============================================================
   CONCEPT
   ============================================================ */

/* "自己実現" — char-by-char reveal on scroll */
const conceptKeyword = document.querySelector('.concept-keyword');
if (conceptKeyword) {
  const kwChars = splitToChars(conceptKeyword);
  gsap.from(kwChars, {
    opacity:  0,
    y:        48,
    duration: 0.88,
    stagger:  0.08,
    ease:     'power3.out',
    scrollTrigger: {
      trigger: conceptKeyword,
      start:   'top 84%',
      once:    true,
    },
  });
}

revealFadeUp('#concept .section-label', { y: 16, duration: 0.8 });
revealFadeUp('.concept-intro',           { delay: 0.1 });
revealFadeUp('.concept-philosophy',      { delay: 0.2 });

/* ============================================================
   MANAGEMENT
   ============================================================ */
revealFadeUp('.section-header', { y: 24 });

/* Stagger the 5 cards */
gsap.from('.member-card', {
  opacity:  0,
  y:        50,
  duration: 0.85,
  stagger:  0.1,
  ease:     'power3.out',
  scrollTrigger: {
    trigger: '.members-grid',
    start:   'top 82%',
    once:    true,
  },
});

/* ============================================================
   STATS
   ============================================================ */
gsap.from('.stat-item', {
  opacity:  0,
  y:        30,
  duration: 0.75,
  stagger:  0.12,
  ease:     'power3.out',
  scrollTrigger: {
    trigger: '.stats-grid',
    start:   'top 84%',
    once:    true,
  },
});

/* Number count-up */
gsap.utils.toArray('.stat-number').forEach(el => {
  const raw      = el.textContent.replace(/[^0-9]/g, '');
  const target   = parseInt(raw, 10);
  const hasSup   = el.querySelector('sup');
  const supHtml  = hasSup ? hasSup.outerHTML : '';
  const hasComma = el.textContent.includes(',');

  if (isNaN(target)) return;

  ScrollTrigger.create({
    trigger: el,
    start:   'top 85%',
    once:    true,
    onEnter() {
      const obj = { val: 0 };
      gsap.to(obj, {
        val:      target,
        duration: 1.8,
        ease:     'power2.out',
        onUpdate() {
          const v = Math.round(obj.val);
          const display = hasComma ? v.toLocaleString('en-US') : v;
          el.innerHTML = display + supHtml;
        },
      });
    },
  });
});

/* ============================================================
   PILLARS
   — Reveal + subtle depth parallax on main image (desktop only).
   — Parallax is on the container (.pillar-img-main-wrap), not the <img>,
     so it doesn't conflict with the CSS hover scale on the img.
   — GSAP tracks x and yPercent as independent transform components,
     so the entry x:-30 tween and the scrub yPercent tween compose cleanly.
   ============================================================ */
gsap.utils.toArray('.pillar').forEach(pillar => {
  const content = pillar.querySelector('.pillar-content');
  const imgMain = pillar.querySelector('.pillar-img-main-wrap');
  const imgSub  = pillar.querySelector('.pillar-img-sub-wrap');

  if (imgMain) {
    gsap.from(imgMain, {
      opacity:  0,
      x:        -30,
      duration: 1.1,
      ease:     'power3.out',
      scrollTrigger: { trigger: pillar, start: 'top 80%', once: true },
    });

    /* Depth parallax — container drifts up slightly as user scrolls through */
    if (isDesktop) {
      gsap.to(imgMain, {
        yPercent: -5,
        ease:     'none',
        scrollTrigger: {
          trigger: pillar,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   2,
        },
      });
    }
  }

  if (imgSub) {
    gsap.from(imgSub, {
      opacity:  0,
      scale:    0.92,
      duration: 1.0,
      delay:    0.2,
      ease:     'power3.out',
      scrollTrigger: { trigger: pillar, start: 'top 80%', once: true },
    });
  }

  if (content) {
    gsap.from(content.children, {
      opacity:  0,
      y:        28,
      duration: 0.85,
      stagger:  0.09,
      ease:     'power3.out',
      scrollTrigger: { trigger: content, start: 'top 82%', once: true },
    });
  }
});

/* ============================================================
   HISTORY
   ============================================================ */
revealFadeLeft('.timeline-item', { stagger: 0.08, duration: 0.7 });

/* ============================================================
   GALLERY
   ============================================================ */
gsap.from('.gallery-item', {
  opacity:  0,
  y:        24,
  scale:    0.97,
  duration: 0.8,
  stagger:  0.07,
  ease:     'power3.out',
  scrollTrigger: {
    trigger: '.gallery-grid',
    start:   'top 85%',
    once:    true,
  },
});

/* ============================================================
   FOOTER
   ============================================================ */
revealFadeUp('.footer-inner > *', { stagger: 0.1, y: 20 });

/* ============================================================
   POST-LOAD REFRESH
   画像の非同期読み込みによってレイアウトが変わった後、
   ScrollTrigger の全トリガー位置を再計算する。
   ============================================================ */
window.addEventListener('load', () => ScrollTrigger.refresh());
