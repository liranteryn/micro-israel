'use strict';

const CDN = 'https://www.micro-scooters.co.uk/cdn/shop/files/';

// ── Mobile nav toggle ────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function openMenu() {
  mobileMenu.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  hamburger?.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  mobileMenu.classList.remove('is-open');
  document.body.style.overflow = '';
  hamburger?.setAttribute('aria-expanded', 'false');
}

hamburger?.addEventListener('click', openMenu);
mobileClose?.addEventListener('click', closeMenu);
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ── Active nav link ──────────────────────────────────────────────────────────
const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.site-nav__item, .mobile-menu__item').forEach(link => {
  if (link.getAttribute('href') === current) link.classList.add('active');
});

// ── Scroll fade-in ───────────────────────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
}

// ── Animated count-up ────────────────────────────────────────────────────────
function formatCount(value, decimals) {
  // Compact form for ≥ 1M so 2,000,000 renders as "2M" not "2,000,000".
  if (decimals === 0 && value >= 1_000_000) {
    const m = value / 1_000_000;
    return (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + 'M';
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = String(target).includes('.') ? String(target).split('.')[1].length : 0;
  const duration = 1500;
  const start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = formatCount(ease * target, decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

if ('IntersectionObserver' in window) {
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
}

// ── Blog filter ──────────────────────────────────────────────────────────────
window.filterPosts = function(cat) {
  document.querySelectorAll('.blog-card[data-category]').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
  });
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === cat);
  });
};
