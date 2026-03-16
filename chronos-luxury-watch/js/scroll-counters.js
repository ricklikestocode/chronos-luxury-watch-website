// Scroll-triggered counter animation using requestAnimationFrame
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.counter-value[data-target]');
  let hasAnimated = false;
  
  // Use IntersectionObserver to detect when counters section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateNumbers();
      }
    });
  }, { threshold: 0.5 });
  
  const specsSection = document.querySelector('.specs-section');
  if (specsSection) observer.observe(specsSection);
  
  function animateNumbers() {
    const duration = 2000; // 2 seconds animation
    
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const startTime = performance.now();
      
      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = target * easeOut;
        
        counter.textContent = Math.floor(current);
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }
      
      requestAnimationFrame(updateCounter);
    });
  }

  // Fade ins for all sections/cards using IntersectionObserver
  const fadeElements = document.querySelectorAll('section, .movement-card, .gallery-grid img, [data-animate="fade"]');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        entry.target.classList.add('active');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeObserver.observe(el);
  });
  
  console.log('Scroll counters + fade-ins ready');
});
