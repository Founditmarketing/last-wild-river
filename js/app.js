// 1. Core Setups
gsap.registerPlugin(ScrollTrigger);

// Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Custom Cursor (Desktop Only)
if (window.innerWidth > 640) {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  const hoverTargets = document.querySelectorAll('.hover-target');

  window.addEventListener('mousemove', (e) => {
    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(cursorOutline, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power2.out" });
  });

  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
    target.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
  });
}

// Mobile Menu
const toggle = document.querySelector('.nav-toggle');
// Basic toggle logic if needed, kept simple

// 2. Preloader & Intro Animation
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    
    // Hero Entrance Anim - Opacity & Transform ONLY to prevent CLS
    const tl = gsap.timeline();
    tl.fromTo('.hero-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
      .fromTo('.hero-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.6')
      .fromTo('.hero-sub', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8')
      .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.5');
  }, 500);
});

// 3. Navigation Scroll State
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: self => {
    if (self.direction === 1) {
      nav.classList.add('scrolled');
    } else if(self.progress === 0) {
      nav.classList.remove('scrolled');
    }
  }
});

// 4. Parallax Elements (Opacity & Transform only)
gsap.utils.toArray('[data-speed]').forEach(el => {
  const speed = el.getAttribute('data-speed');
  gsap.to(el, {
    y: (i, el) => (1 - parseFloat(speed)) * (ScrollTrigger.maxScroll(window) - (ScrollTrigger.maxScroll(window) / 2)),
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 0
    }
  });
});

// 5. Global Scroll Reveals (Opacity & Transform ONLY)
gsap.utils.toArray('.section-title').forEach(title => {
  gsap.fromTo(title, 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: title, start: "top 85%" } }
  );
});

// Animate opacity and transform of the divider, NOT width
gsap.utils.toArray('.gold-divider').forEach(line => {
    gsap.fromTo(line,
      { opacity: 0, x: -30, width: "100px" },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: line, start: "top 85%" } }
    );
});

gsap.utils.toArray('.section-text').forEach(text => {
  gsap.fromTo(text, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 1, delay: 0.1, ease: 'power3.out', scrollTrigger: { trigger: text, start: "top 85%" } }
  );
});

// Staggered triggers
gsap.fromTo('.stat-item', 
  { opacity: 0, y: 30 }, 
  { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.intro-stats', start: "top 90%" } }
);

gsap.fromTo('.bento-item', 
  { opacity: 0, y: 40 }, 
  { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.bento-grid', start: "top 80%" } }
);

gsap.fromTo('.venue-feature', 
  { opacity: 0, y: 30 }, 
  { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.venue-features', start: "top 85%" } }
);

gsap.fromTo('.amenity-item', 
  { opacity: 0, y: 20 }, 
  { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', scrollTrigger: { trigger: '.amenity-row', start: "top 85%" } }
);

gsap.fromTo('.trail-item', 
  { opacity: 0, x: -20 }, 
  { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.trail-list', start: "top 85%" } }
);

// 6. Testimonials Slider Logic
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.slider-dot');
const track = document.querySelector('.testimonials-track');
let currentSlide = 0;

if(dots.length > 0) {
    function goToSlide(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlide = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Autoplay
    setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }, 6000);
}

// 7. Lightbox Logic
const galleryStrip = document.querySelector('.gallery-strip');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
    <button class="lightbox-close">&times;</button>
    <img src="" alt="Gallery Image" class="lightbox-img">
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxClose = lightbox.querySelector('.lightbox-close');

if (galleryStrip) {
    galleryStrip.addEventListener('click', (e) => {
        if(e.target.tagName === 'IMG') {
            lightboxImg.src = e.target.src;
            lightbox.classList.add('open');
            lenis.stop(); // Pause scrolling while modal open
        }
    });
}
lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('open');
    lenis.start();
});

// 8. Booking Modal Logic
const bookingModal = document.querySelector('.booking-modal');
const bookingTriggers = document.querySelectorAll('.trigger-booking');
const bookingCloses = document.querySelectorAll('.booking-close');

bookingTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        bookingModal.classList.add('open');
        lenis.stop();
    });
});

bookingCloses.forEach(btn => {
    btn.addEventListener('click', () => {
        bookingModal.classList.remove('open');
        lenis.start();
    });
});
