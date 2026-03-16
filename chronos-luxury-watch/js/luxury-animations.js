document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it's revealed, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Get all sections and elements with reveal class
    const revealElements = document.querySelectorAll('.reveal-on-scroll, section');
    
    revealElements.forEach(el => {
        // Add reveal-on-scroll class if it's a section without it
        if (!el.classList.contains('reveal-on-scroll')) {
            el.classList.add('reveal-on-scroll');
        }
        revealObserver.observe(el);
    });

    // Smooth Scroll Reveal for the hero video on load
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.classList.add('luxury-video-enhanced');
    }
});
