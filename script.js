// ===============================
// DSP Real Estate - Modern Frontend Logic
// ===============================

// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1000);
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    
    // Animate hamburger
    const spans = menuToggle.querySelectorAll('span');
    if (isActive) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      document.body.style.overflow = 'hidden';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
      document.body.style.overflow = '';
    }
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
      document.body.style.overflow = '';
    }
  });
});

// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    
    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    const headerOffset = 100;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Animate bar fills
      if (entry.target.closest('.visual-card')) {
        const bars = entry.target.closest('.visual-card').querySelectorAll('.bar-fill');
        bars.forEach(bar => {
          const width = bar.style.width;
          bar.style.setProperty('--target-width', width);
          bar.classList.add('animate');
        });
      }
    }
  });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
  '.service-card, .feature-item, .process-step, .about-stat, .contact-item, .visual-card'
);

animateElements.forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.1}s`;
  fadeObserver.observe(el);
});

// Active nav link based on scroll position
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
});

// Contact form handling with Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = '<span>Envoi en cours...</span>';
    btn.disabled = true;
    
    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Success
        btn.innerHTML = '<span>Message envoyé! ✓</span>';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        this.reset();
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      // Error
      btn.innerHTML = '<span>Erreur - Réessayez</span>';
      btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

// Parallax effect for hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroVideo = document.querySelector('.hero-video');
  const heroContent = document.querySelector('.hero-content');
  const heroStatsBar = document.querySelector('.hero-stats-bar');
  
  if (heroVideo && scrolled < window.innerHeight) {
    heroVideo.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.2}px))`;
  }
  
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
    heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
  }

  if (heroStatsBar && scrolled < window.innerHeight) {
    heroStatsBar.style.opacity = 1 - (scrolled / window.innerHeight) * 1.2;
  }
});

// Counter animation for stats
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number, .stat-value, .big-number');
      counters.forEach(counter => {
        animateCounter(counter);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

function animateCounter(element) {
  const text = element.textContent;
  const match = text.match(/(\d+)/);
  if (!match) return;
  
  const target = parseInt(match[0]);
  const suffix = text.replace(match[0], '').trim();
  const prefix = text.split(match[0])[0];
  const duration = 2000;
  const start = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * easeOut);
    
    element.textContent = prefix + current + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = text;
    }
  }
  
  requestAnimationFrame(update);
}

// Observe stat containers
document.querySelectorAll('.glass-stats, .about-stats, .visual-stat').forEach(container => {
  counterObserver.observe(container);
});

// Progressive image loading
document.querySelectorAll('img').forEach(img => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
  }
});

// Duplicate marquee content for seamless loop
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  const content = marqueeTrack.innerHTML;
  marqueeTrack.innerHTML = content + content;
}

// Touch events for mobile cards
if ('ontouchstart' in window) {
  document.querySelectorAll('.service-card, .feature-item, .contact-item').forEach(card => {
    card.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  });
}

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
  // ESC closes mobile menu
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
    document.body.style.overflow = '';
  }
});

// Console branding
console.log('%c DSPImmo ', 'background: linear-gradient(135deg, #1d0d60 0%, #005ba9 50%, #38c0df 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 4px;');
console.log('%c Excellence Immobilière au Luxembourg ', 'color: #38c0df; font-size: 12px;');

// ===============================
// Anti-Bot Email & Phone Protection
// ===============================

// Reveal email on click (prevents bot scraping)
function revealEmail(e) {
  e.preventDefault();
  const display = document.getElementById('emailDisplay');
  const user = display.dataset.user;
  const domain = display.dataset.domain;
  const email = user + '@' + domain;
  
  display.textContent = email;
  
  const link = document.getElementById('emailLink');
  link.href = 'mai' + 'lto:' + email;
  link.onclick = null;
}

// Reveal phone on click (prevents bot scraping)
function revealPhone(e) {
  e.preventDefault();
  const display = document.getElementById('phoneDisplay');
  const phone = display.dataset.p1 + ' ' + display.dataset.p2 + ' ' + display.dataset.p3 + ' ' + display.dataset.p4 + ' ' + display.dataset.p5;
  const phoneClean = phone.replace(/\s/g, '');
  
  display.textContent = phone;
  
  const link = document.getElementById('phoneLink');
  link.href = 'te' + 'l:' + phoneClean;
  link.onclick = null;
}

// Auto-reveal footer contact info on page load (assembled via JS, not in HTML)
document.addEventListener('DOMContentLoaded', () => {
  // Footer email
  const footerEmails = document.querySelectorAll('.footer-email');
  footerEmails.forEach(el => {
    const user = el.dataset.user;
    const domain = el.dataset.domain;
    el.textContent = user + '@' + domain;
  });
  
  // Footer phone
  const footerPhones = document.querySelectorAll('.footer-phone');
  footerPhones.forEach(el => {
    const phone = el.dataset.p1 + ' ' + el.dataset.p2 + ' ' + el.dataset.p3 + ' ' + el.dataset.p4 + ' ' + el.dataset.p5;
    el.textContent = phone;
  });
});