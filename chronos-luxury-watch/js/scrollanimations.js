/* =========================================================
CHRONOS SCROLL ENGINE - CLEAN VERSION
Scroll-triggered only, no continuous rAF/mouse/glows
Keeps IO fades, parallax, procedural runner
========================================================= */

(function() {
  'use strict';

  let ticking = false;
  let scrollY = 0;
  let animations = [];

  // Utilities
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function getProgress(rect) {
    return clamp(1 - rect.top / window.innerHeight, 0, 1);
  }

  // Animation registry
  window.registerAnimation = function(fn) {
    animations.push(fn);
  };

  // Throttled scroll handler (no continuous rAF)
  function onScroll() {
    scrollY = window.scrollY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(runScrollUpdate);
    }
  }

  function runScrollUpdate() {
    // Update parallax
    const layers = document.querySelectorAll('.parallax-layer');
    Array.from(layers).forEach((layer, index) => {
      const speed = (index + 1) * 0.25;
      layer.style.transform = `translateY(${scrollY * speed}px)`;
    });

    // Run procedural animations on scroll (no loops)
    animations.forEach(fn => fn());

    ticking = false;
  }

  // IntersectionObserver for fades/zooms (scroll-triggered only)
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, {
    threshold: [0.1, 0.8],
    rootMargin: '0px 0px -100px 0px'
  });

  // Observe fade elements
  function initObserver() {
    const fadeElements = document.querySelectorAll('[data-animate="fade"], .reveal, .fade-in, .zoom-in, .movement-card, .gallery-grid img');
    Array.from(fadeElements).forEach(el => fadeObserver.observe(el));
  }

  // Section active (for reveal)
  function updateSections() {
    const sections = document.querySelectorAll('section');
    Array.from(sections).forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 120) {
        section.classList.add('active');
      }
    });
  }

  // Hero parallax procedural (scroll only)
  window.registerAnimation(() => {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
      const progress = getProgress(heroVideo.getBoundingClientRect());
      const scale = 1 + progress * 0.12;
      const move = progress * -70;
      heroVideo.style.transform = `scale(${scale}) translateY(${move}px)`;
    }
  });

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    initObserver();
    updateSections();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', updateSections, { passive: true });
    console.log('Chronos Scroll Engine Clean Ready - Scroll only');
  });

  window.addEventListener('resize', () => {
    initObserver();
    updateSections();
  });
})();

