/* ========================================
   THEME TOGGLE
======================================== */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const icon = themeToggle.querySelector('i');

const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);
icon.className = saved === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  icon.className = next === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});

/* ========================================
   MOBILE NAV
======================================== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelector('i').className = 'fa-solid fa-bars';
  });
});

/* ========================================
   TYPING ANIMATION
======================================== */
const phrases = [
  'MCA Student',
  'Python Enthusiast',
  'Aspiring Data Analyst',
  'AI & ML Explorer',
  'Problem Solver'
];

let pIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typingEl.textContent = phrase.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === phrase.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typingEl.textContent = phrase.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

/* ========================================
   PARTICLE CANVAS
======================================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

const PARTICLE_COUNT = Math.min(80, Math.floor(W * H / 12000));

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : H + 10;
    this.r = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(Math.random() * 0.5 + 0.15);
    this.alpha = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += 0.02;
    if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
  }
  draw() {
    const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(139, 92, 246, ${a})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

// Connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

/* ========================================
   SCROLL REVEAL
======================================== */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

/* ========================================
   ANIMATED COUNTERS
======================================== */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target.querySelector('.counter-num');
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-card').forEach(card => counterObserver.observe(card));

/* ========================================
   SCROLL TO TOP
======================================== */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);

  // Navbar shadow on scroll
  const navbar = document.getElementById('navbar');
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 4px 24px rgba(0,0,0,0.2)'
    : 'none';
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========================================
   CONTACT FORM
======================================== */
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

  setTimeout(() => {
    formMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
    formMsg.style.color = '#c084fc';
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    setTimeout(() => { formMsg.textContent = ''; }, 4000);
  }, 1200);
});

/* ========================================
   ACTIVE NAV HIGHLIGHT ON SCROLL
======================================== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 100) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
      ? 'var(--purple-light)'
      : '';
  });
}

window.addEventListener('scroll', updateActiveNav);
