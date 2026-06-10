// ===== DEPLOY TIME =====
const deployTime = document.getElementById('deploy-time');
const footerTime = document.getElementById('footer-time');
const buildNum = document.getElementById('build-num');

const now = new Date();
if (deployTime) deployTime.textContent = now.toLocaleString();
if (footerTime) footerTime.textContent = now.toUTCString();
if (buildNum) buildNum.textContent = Math.floor(Math.random() * 50) + 40;

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ===== PIPELINE ANIMATION =====
const pipeSteps = document.querySelectorAll('.pipe-step');
let current = 0;
function animatePipeline() {
  pipeSteps.forEach(s => s.classList.remove('active', 'lit'));
  pipeSteps[current].classList.add('active');
  for (let i = 0; i < current; i++) pipeSteps[i].classList.add('lit');
  current = (current + 1) % pipeSteps.length;
}
animatePipeline();
setInterval(animatePipeline, 1200);

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1600;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-number').forEach(animateCounter);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelector('.stats-section') && observer.observe(document.querySelector('.stats-section'));

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.step-card, .tech-card, .env-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  revealObserver.observe(el);
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--primary)' : '';
  });
});
