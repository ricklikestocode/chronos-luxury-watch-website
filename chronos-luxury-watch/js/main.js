document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const preloader = document.querySelector(".preloader");
  const craftingLetters = document.querySelectorAll(".crafting-letter");
  const chronosLetters = document.querySelectorAll(".chronos-letter");
  const navbar = document.querySelector(".navbar");
  const progressBar = document.querySelector(".scroll-progress");
  const viewer = document.querySelector(".watch-viewer");
  const watchImage = document.querySelector("#watch-3d");
  const philosophyHero = document.querySelector(".chronos-philosophy img");
  const revealElements = document.querySelectorAll(
    "section, .movement-card, .gallery-item, .spec-card, .card, .testimonial-card, .chronos-philosophy, .gallery-grid img, .crafter-content"
  );

  body.classList.add("preloader-active");

  function initPreloader() {
    if (!preloader) {
      body.classList.remove("preloader-active");
      return;
    }

    craftingLetters.forEach((letter, index) => {
      window.setTimeout(() => {
        letter.style.opacity = "1";
        letter.style.transform = "translateY(0)";
        letter.style.transition = "opacity 0.45s ease, transform 0.45s ease";
      }, index * 120);
    });

    window.setTimeout(() => {
      chronosLetters.forEach((letter, index) => {
        window.setTimeout(() => {
          letter.style.opacity = "1";
          letter.style.transform = "translateY(0)";
          letter.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        }, index * 120);
      });
    }, 1500);

    window.setTimeout(() => {
      preloader.classList.add("hide");
      body.classList.remove("preloader-active");

      window.setTimeout(() => {
        preloader.style.display = "none";
      }, 800);
    }, 3000);
  }

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 24) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  function updateScrollProgress() {
    if (!progressBar) return;

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(percent, 100)}%`;
  }

  function initRevealObserver() {
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    revealElements.forEach((element) => {
      element.classList.add("reveal-on-scroll");
    });

    const observer = new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          if (entry.target.classList.contains("crafter-content")) {
            entry.target.classList.add("reveal");
          }
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function initViewerTilt() {
    if (!viewer || !watchImage) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = null;

    const animateTilt = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      watchImage.style.transform = `perspective(900px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale(1.05)`;

      if (
        Math.abs(currentX - targetX) > 0.01 ||
        Math.abs(currentY - targetY) > 0.01
      ) {
        rafId = requestAnimationFrame(animateTilt);
      } else {
        rafId = null;
      }
    };

    viewer.addEventListener("mousemove", (event) => {
      const rect = viewer.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

      targetY = relativeX * 14;
      targetX = relativeY * -14;

      if (!rafId) {
        rafId = requestAnimationFrame(animateTilt);
      }
    });

    viewer.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;

      if (!rafId) {
        rafId = requestAnimationFrame(animateTilt);
      }
    });
  }

  function updatePhilosophyParallax() {
    if (!philosophyHero) return;
    const parent = philosophyHero.closest(".chronos-philosophy");
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    if (rect.top < viewHeight && rect.bottom > 0) {
      const scrollProgress = 1 - rect.bottom / (viewHeight + rect.height);
      const scale = 1.05 - scrollProgress * 0.05;
      const yPos = (scrollProgress - 0.5) * 60;
      philosophyHero.style.transform = `scale(${Math.max(1, scale)}) translateY(${yPos}px)`;
    }
  }

  initPreloader();
  initRevealObserver();
  initViewerTilt();
  updateNavbar();
  updateScrollProgress();

  window.addEventListener(
    "scroll",
    () => {
      updateNavbar();
      updateScrollProgress();
      updatePhilosophyParallax();
    },
    { passive: true }
  );
});
