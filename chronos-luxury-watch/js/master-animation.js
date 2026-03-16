/* MASTER ANIMATION CONTROLLER - Forces RAF + Scroll */
let rafId = 0;
window.addEventListener('load', function() {
  function masterLoop() {
    // Force all animation systems
    if (window.ChronosEngine) ChronosEngine.frameUpdate();
    rafId = requestAnimationFrame(masterLoop);
  }
  masterLoop();
});

// Global scroll trigger for all engines
window.addEventListener('scroll', function() {
  if (window.ChronosEngine) ChronosEngine.handleScroll();
}, {passive: true});

console.log('Master Animation Controller ACTIVE');
