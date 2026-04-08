/**
 * assets/js/chatbot.js
 * Módulo do chatbot — gerencia UI, estado e comunicação com o backend.
 * A API key NÃO existe aqui. Toda chamada vai para o backend local.
 */

'use strict';

// ─── Configuração ────────────────────────────────────────────────────────────

/** URL base do backend. Altere para o endereço de produção quando necessário. */
const API_BASE_URL = 'https://portfolio-v2-production-895e.up.railway.app';

/** Endpoint do chat no backend */
const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;

// ─── Estado ──────────────────────────────────────────────────────────────────

/** Histórico de mensagens enviado ao backend a cada requisição */
const chatHistory = [];

/** Flag para evitar envios simultâneos enquanto aguarda resposta */
let isWaitingResponse = false;

// ─── Referências ao DOM ──────────────────────────────────────────────────────

let chatPanel, chatMessages, chatInput;

// ─── Funções de UI ───────────────────────────────────────────────────────────

/**
 * Abre ou fecha o painel do chat.
 */
function toggleChat() {
  chatPanel.classList.toggle('open');
}

/**
 * Cria e adiciona uma mensagem na área de chat.
 *
 * @param {string} text - Conteúdo da mensagem
 * @param {'bot'|'user'} type - Quem enviou a mensagem
 * @returns {HTMLElement} O elemento criado
 */
function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `msg msg-${type}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  scrollToBottom();
  return div;
}

/**
 * Exibe o indicador animado de "digitando…"
 */
function showTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'msg msg-bot';
  div.id = 'typing-indicator';
  div.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
  chatMessages.appendChild(div);
  scrollToBottom();
}

/**
 * Remove o indicador de "digitando…"
 */
function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

/**
 * Garante que a área de mensagens sempre mostre a última mensagem.
 */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ─── Comunicação com o Backend ───────────────────────────────────────────────

/**
 * Envia uma mensagem ao backend e retorna a resposta do assistente.
 * Toda chamada à API da Anthropic acontece no servidor — nunca aqui.
 *
 * @param {string} userMessage - Texto enviado pelo usuário
 * @returns {Promise<string>} Resposta do assistente
 */
async function fetchBotReply(userMessage) {
  // Adiciona a mensagem do usuário ao histórico antes de enviar
  chatHistory.push({ role: 'user', content: userMessage });

  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history: chatHistory }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status}`);
  }

  const data = await response.json();
  const reply = data.reply;

  // Adiciona a resposta ao histórico para manter contexto na próxima mensagem
  chatHistory.push({ role: 'assistant', content: reply });

  return reply;
}

// ─── Fluxo Principal de Envio ────────────────────────────────────────────────

/**
 * Orquestra o fluxo completo: exibe a mensagem, mostra typing,
 * busca resposta e trata erros.
 *
 * @param {string} text - Texto da mensagem a enviar
 */
async function processMessage(text) {
  if (isWaitingResponse || !text.trim()) return;

  isWaitingResponse = true;

  addMessage(text, 'user');

  // Pequeno delay antes do indicador para parecer mais natural
  await delay(300);
  showTypingIndicator();

  try {
    const reply = await fetchBotReply(text);
    removeTypingIndicator();
    addMessage(reply, 'bot');
  } catch (err) {
    console.error('[Chatbot] Erro ao buscar resposta:', err.message);
    removeTypingIndicator();
    addMessage(
      'Ops! Não consegui me conectar agora. Você pode entrar em contato pelo email ou LinkedIn! 📬',
      'bot'
    );
    // Remove a última mensagem do histórico pois a requisição falhou
    chatHistory.pop();
  } finally {
    isWaitingResponse = false;
  }
}

/**
 * Handler do botão de enviar e tecla Enter no input.
 */
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  processMessage(text);
}

/**
 * Handler dos chips de sugestão rápida.
 *
 * @param {HTMLElement} element - O chip clicado
 */
function sendSuggestion(element) {
  const text = element.textContent.trim();
  processMessage(text);
}

// ─── Utilitários ─────────────────────────────────────────────────────────────

/**
 * Promise que resolve após `ms` milissegundos.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Inicialização ───────────────────────────────────────────────────────────

/**
 * Configura os event listeners assim que o DOM estiver pronto.
 */
function initChatbot() {
  chatPanel    = document.getElementById('chat-panel');
  chatMessages = document.getElementById('chat-messages');
  chatInput    = document.getElementById('chat-input');

  document.getElementById('chat-btn').addEventListener('click', toggleChat);

  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') sendMessage();
  });

  document.querySelector('.chat-send').addEventListener('click', sendMessage);

  document.querySelector('.chat-suggestions').addEventListener('click', (event) => {
    const chip = event.target.closest('.chat-sugg');
    if (chip) sendSuggestion(chip);
  });
}

document.addEventListener('DOMContentLoaded', initChatbot);
