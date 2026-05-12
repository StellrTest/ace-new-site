// ACE Performance Gym — Main JS

// ── Mobile nav toggle ─────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

// ── Dropdown toggles (mobile tap) ─────────────────────
document.querySelectorAll('.dropdown-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item    = btn.closest('.nav-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});

// ── Close mobile nav on outside click ─────────────────
document.addEventListener('click', e => {
  if (!e.target.closest('.site-nav') && navMenu?.classList.contains('open')) {
    navMenu.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// ── Close on nav link click (mobile) ──────────────────
navMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── Nav scroll opacity ────────────────────────────────
const siteNav = document.querySelector('.site-nav');
if (siteNav) {
  const onScroll = () => {
    siteNav.style.background = window.scrollY > 40
      ? 'rgba(0,0,0,0.97)'
      : 'rgba(5,5,5,0.9)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Active link highlight ─────────────────────────────
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[href]').forEach(link => {
  if (link.getAttribute('href') === currentFile) {
    link.classList.add('active');
  }
});

// ── Custom smooth scroll (ease-out quart) ────────────
function smoothScrollTo(y, duration) {
  const start = window.scrollY;
  const diff  = y - start;
  if (Math.abs(diff) < 2) return;
  let t0 = null;
  function step(ts) {
    if (!t0) t0 = ts;
    const elapsed = ts - t0;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    window.scrollTo(0, start + diff * eased);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72) + 16;
      smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - offset, 960);
    }
  });
});

// ── Auto scroll-reveal injection ──────────────────────
(function injectReveal() {
  // Apply data-reveal to elements, with optional per-parent staggering
  function apply(sel, dir, stagger) {
    const els = document.querySelectorAll(sel);
    if (!stagger) {
      els.forEach(el => {
        if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', dir);
      });
      return;
    }
    const groups = new Map();
    els.forEach(el => {
      const key = el.parentElement;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(el);
    });
    groups.forEach(items => {
      items.forEach((el, i) => {
        if (!el.hasAttribute('data-reveal')) {
          el.setAttribute('data-reveal', dir);
          if (i > 0) el.setAttribute('data-reveal-delay', String(Math.min(i, 6)));
        }
      });
    });
  }

  // Section headings
  apply('.section-label',            '',       false);
  apply('.section-title',            '',       false);
  apply('.section-sub',              '',       false);
  apply('.breadcrumb',               '',       false);
  apply('.rates-note',               '',       false);
  apply('.rates-note-box',           '',       false);
  apply('.pricing-section-divider',  '',       false);
  apply('.highlight-stat',           '',       false);

  // Cards — staggered within their grids
  apply('.pricing-card',     '',       true);
  apply('.review-card',      '',       true);
  apply('.pack-card',        '',       true);
  apply('.detail-card',      '',       true);
  apply('.hours-card',       '',       true);
  apply('.award-card',       '',       true);
  apply('.instructor-card',  '',       true);
  apply('.add-on-card',      '',       true);
  apply('.glass-card',       '',       true);
  apply('.promo-block',      '',       false);

  // Gallery items
  apply('.gallery-item',      'scale', true);
  apply('.gallery-roof-item', 'scale', true);

  // Stats
  apply('.stat-item',   'scale', true);
  apply('.about-stat',  'scale', true);
  apply('.inbody-stat', 'scale', true);

  // Steps / process
  apply('.step',          'left',  true);
  apply('.guarantee-box', '',      false);

  // About section — left/right split
  apply('.about-text', 'left',  false);
  apply('.about-card', 'right', false);

  // Facility alternating
  apply('.facility-text', 'left',  false);
  apply('.facility-img',  'scale', false);

  // Trainer card
  apply('.trainer-card', '', false);

  // Roof page
  apply('.roof-text',         'left',  false);
  apply('.roof-img',          'scale', false);
  apply('.day-pass-card',     '',      false);
  apply('.contact-box',       '',      false);
  apply('.badge-strip-inner', '',      false);

  // Trust bar items
  apply('.trust-item', '', true);

  // Page hero & home hero content
  apply('.page-hero-content', '', false);
  apply('.hero-content',      '', false);

  // CTA
  apply('.cta-banner .cta-btns', '', false);
})();

// ── Scroll reveal observer ────────────────────────────
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));
}

// ── Counter animations ────────────────────────────────
(function initCounters() {
  if (!('IntersectionObserver' in window)) return;

  // Only target simple text nodes (no child elements)
  const candidates = [
    ...document.querySelectorAll('.stat-num, .about-stat strong, .inbody-stat strong'),
    ...[...document.querySelectorAll('.pack-price, .add-on-price')].filter(el => el.children.length === 0),
  ];

  if (!candidates.length) return;

  function animateCount(el) {
    const raw = el.textContent.trim();
    const m = raw.match(/^([+$]?)(\d+(?:\.\d+)?)(K|%|\+|s)?$/);
    if (!m) return;
    const prefix  = m[1];
    const target  = parseFloat(m[2]);
    const suffix  = m[3] || '';
    const decimal = m[2].includes('.');
    const dur     = 1500;
    let t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = target * e;
      el.textContent = prefix + (decimal ? v.toFixed(2) : Math.floor(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + (decimal ? target.toFixed(2) : String(target)) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counterObs.unobserve(entry.target);
      animateCount(entry.target);
    });
  }, { threshold: 0.5 });

  candidates.forEach(el => counterObs.observe(el));
})();
