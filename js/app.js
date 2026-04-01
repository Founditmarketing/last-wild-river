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

// Mobile Menu
const nav = document.getElementById('nav');
const toggle = document.querySelector('.nav-toggle');
const mobileLinks = document.querySelectorAll('.nav-link');

if (toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('menu-open');
    if(nav.classList.contains('menu-open')) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });
}

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('menu-open');
    lenis.start();
  });
});

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

// 8. Booking Modal & Concierge Logic
const modal = document.querySelector('.booking-modal');
const triggers = document.querySelectorAll('.trigger-booking');
const closeBtn = document.querySelector('.booking-close');

if(modal && triggers && closeBtn) {
  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      const mobileNav = document.getElementById('nav');
      if (mobileNav && mobileNav.classList.contains('menu-open')) {
        mobileNav.classList.remove('menu-open');
      }
      lenis.stop();
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    lenis.start();
    // Reset to step 1
    setTimeout(() => switchStep('1'), 400); 
  });
}

// Step form logic
const nextBtns = document.querySelectorAll('.c-next');
const backBtns = document.querySelectorAll('.c-back');
const steps = document.querySelectorAll('.concierge-step');

function switchStep(targetId) {
  steps.forEach(step => {
    step.classList.add('hidden');
    step.classList.remove('active');
  });
  const target = document.getElementById('c-step-' + targetId);
  if(target) {
    target.classList.remove('hidden');
    // slight delay for CSS animation
    setTimeout(() => target.classList.add('active'), 10);
  }
}

nextBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const nextId = btn.getAttribute('data-next');
    switchStep(nextId);
  });
});

backBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const backId = btn.getAttribute('data-back');
    switchStep(backId);
  });
});

// 9. Interactive Trails Logic
const trailItems = document.querySelectorAll('.trail-item.interactable');
const trailsData = [
  { title: "Turkey Trot Trail", diff: "Easy", len: "0.8 Miles", elev: "120ft Elev", desc: "A gentle, winding path perfect for morning strolls. Follows the eastern ridge with beautiful viewpoints of the property." },
  { title: "Sunrise Ridge", diff: "Moderate", len: "1.5 Miles", elev: "340ft Elev", desc: "A steady incline offering the most spectacular sunrise views over the Ouachita valley. Excellent for photography." },
  { title: "Diamondback Pass", diff: "Advanced", len: "2.2 Miles", elev: "680ft Elev", desc: "For the adventurous. Steep, rocky ascents leading to deep forest canopies. Proper footwear required." },
  { title: "River Bend Walk", diff: "Easy", len: "1.0 Miles", elev: "40ft Elev", desc: "Flat, relaxing walk hugging the Glover River shoreline. Best enjoyed at sunset or for a casual afternoon stroll." },
  { title: "Eagle's View", diff: "Moderate", len: "1.8 Miles", elev: "450ft Elev", desc: "Climbs to the highest point overlooking the entire 164 acres. Features a panoramic clearing that is truly unforgettable." }
];

trailItems.forEach(item => {
  item.addEventListener('click', () => {
    // Remove active state
    trailItems.forEach(t => t.classList.remove('active'));
    item.classList.add('active');
    
    const id = item.getAttribute('data-id');
    const data = trailsData[id];
    
    // Animate content swap
    const card = document.querySelector('.trail-info-card');
    if(card) {
      card.style.opacity = '0';
      setTimeout(() => {
        document.getElementById('ti-title').innerText = data.title;
        document.getElementById('ti-diff').innerText = data.diff;
        document.getElementById('ti-len').innerText = data.len;
        document.getElementById('ti-elev').innerText = data.elev;
        document.getElementById('ti-desc').innerText = data.desc;
        card.style.opacity = '1';
      }, 300);
    }
  });
});
