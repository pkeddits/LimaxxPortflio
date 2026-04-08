/**
 * assets/js/ui.js
 * Módulo de interações da UI — separado do chatbot para melhor organização.
 * Contém: efeito de digitação, scroll reveal, abas de skills, menu mobile.
 */

'use strict';

// ─── Efeito de Digitação (Hero) ───────────────────────────────────────────────

const TYPED_WORDS = ['Desenvolvedor', 'Cloud & Infra', 'Tecnologia', 'Full Stack', 'DevOps'];

let currentWordIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

/**
 * Anima o texto rotativo da seção hero.
 * Digita uma palavra, aguarda, apaga e passa para a próxima.
 */
function runTypedEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const currentWord = TYPED_WORDS[currentWordIndex];

  if (!isDeleting) {
    // Adiciona um caractere
    el.textContent = currentWord.slice(0, ++currentCharIndex);

    if (currentCharIndex === currentWord.length) {
      // Palavra completa — pausa antes de apagar
      isDeleting = true;
      setTimeout(runTypedEffect, 2000);
      return;
    }
  } else {
    // Remove um caractere
    el.textContent = currentWord.slice(0, --currentCharIndex);

    if (currentCharIndex === 0) {
      // Palavra apagada — avança para a próxima
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % TYPED_WORDS.length;
    }
  }

  setTimeout(runTypedEffect, isDeleting ? 60 : 110);
}

// ─── Scroll Reveal ───────────────────────────────────────────────────────────

/**
 * Usa IntersectionObserver para revelar elementos com classe .reveal
 * conforme o usuário rola a página.
 */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// ─── Abas de Skills ──────────────────────────────────────────────────────────

/**
 * Alterna entre os painéis de habilidades (Cloud, Dev, Redes).
 *
 * @param {string} tabId - ID da aba (sem o prefixo "tab-")
 * @param {HTMLElement} clickedBtn - Botão que foi clicado
 */
function switchSkillTab(tabId, clickedBtn) {
  // Desativa todos os painéis e botões
  document.querySelectorAll('.skills-panel').forEach((panel) => panel.classList.remove('active'));
  document.querySelectorAll('.skills-tab').forEach((btn) => btn.classList.remove('active'));

  // Ativa o selecionado
  document.getElementById(`tab-${tabId}`).classList.add('active');
  clickedBtn.classList.add('active');
}

// ─── Menu Mobile ─────────────────────────────────────────────────────────────

/**
 * Abre ou fecha o menu de navegação mobile.
 */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const isVisible = menu.style.display !== 'none';
  menu.style.display = isVisible ? 'none' : 'block';
}

// ─── Exposição Global (necessária para handlers inline no HTML) ──────────────
// Apenas as funções chamadas via atributos onclick precisam estar no escopo global.

window.switchTab = switchSkillTab;
window.toggleMenu = toggleMobileMenu;

// ─── Inicialização ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  runTypedEffect();
  initScrollReveal();
});
