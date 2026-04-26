'use strict';

// ── Typed Effect ──────────────────────────────────────────────────────────────
let TYPED_WORDS = ['Cloud & Infra', 'Cybersecurity', 'Linux & Infra', 'Python Dev', 'Dev Web'];
let currentWordIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typedTimer = null;

function runTypedEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const currentWord = TYPED_WORDS[currentWordIndex];
  if (!isDeleting) {
    el.textContent = currentWord.slice(0, ++currentCharIndex);
    if (currentCharIndex === currentWord.length) {
      isDeleting = true;
      typedTimer = setTimeout(runTypedEffect, 2000);
      return;
    }
  } else {
    el.textContent = currentWord.slice(0, --currentCharIndex);
    if (currentCharIndex === 0) {
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % TYPED_WORDS.length;
    }
  }
  typedTimer = setTimeout(runTypedEffect, isDeleting ? 60 : 110);
}

window.restartTyped = function(words) {
  if (typedTimer) clearTimeout(typedTimer);
  TYPED_WORDS = words;
  currentWordIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;
  const el = document.getElementById('typed-text');
  if (el) el.textContent = '';
  runTypedEffect();
};

// ── Scroll Reveal ─────────────────────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Skill Tabs ────────────────────────────────────────────────────────────────
function switchSkillTab(tabId, clickedBtn) {
  document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.skills-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tabId}`).classList.add('active');
  clickedBtn.classList.add('active');
}

// ── Mobile Menu ───────────────────────────────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.style.display = menu.style.display !== 'none' ? 'none' : 'block';
}

window.switchTab = switchSkillTab;
window.toggleMenu = toggleMobileMenu;

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  runTypedEffect();
  initScrollReveal();
  document.getElementById('hamburger-btn')?.addEventListener('click', toggleMobileMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(l => {
    l.addEventListener('click', () => {
      document.getElementById('mobile-menu').style.display = 'none';
    });
  });
});
