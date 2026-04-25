/**
 * chatbot.js
 * Módulo do chatbot — gerencia UI, estado e comunicação com o backend.
 * A API key NÃO existe aqui. Toda chamada vai para o backend.
 */

'use strict';

// ─── Configuração ────────────────────────────────────────────────────────────

const API_BASE_URL = 'https://portfolio-v2-production-895e.up.railway.app';
const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;

// ─── Estado ──────────────────────────────────────────────────────────────────

const chatHistory = [];
let isWaitingResponse = false;

// ─── Referências ao DOM ──────────────────────────────────────────────────────

let chatPanel, chatMessages, chatInput;

// ─── Funções de UI ───────────────────────────────────────────────────────────

function toggleChat() {
  chatPanel.classList.toggle('open');
}

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `msg msg-${type}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  scrollToBottom();
  return div;
}

function showTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'msg msg-bot';
  div.id = 'typing-indicator';
  div.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
  chatMessages.appendChild(div);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ─── Comunicação com o Backend ───────────────────────────────────────────────

async function fetchBotReply(userMessage) {
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

  chatHistory.push({ role: 'assistant', content: reply });

  return reply;
}

// ─── Fluxo Principal ─────────────────────────────────────────────────────────

async function processMessage(text) {
  if (isWaitingResponse || !text.trim()) return;

  isWaitingResponse = true;
  addMessage(text, 'user');

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
    chatHistory.pop();
  } finally {
    isWaitingResponse = false;
  }
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  processMessage(text);
}

function sendSuggestion(element) {
  processMessage(element.textContent.trim());
}

// ─── Utilitários ─────────────────────────────────────────────────────────────

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Inicialização ───────────────────────────────────────────────────────────

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