'use strict';

const API_BASE_URL = 'https://portfolio-v2-production-895e.up.railway.app';
const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;

const chatHistory = [];
let isWaitingResponse = false;
let chatPanel, chatMessages, chatInput;

// ── Toggle chat ───────────────────────────────────────────────────────────────
function toggleChat() {
  chatPanel.classList.toggle('open');
}

// ── Add message with animation ────────────────────────────────────────────────
function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `msg msg-${type}`;
  div.style.opacity = '0';

  if (type === 'bot') {
    // Typewriter effect for bot messages
    chatMessages.appendChild(div);
    scrollToBottom();
    typewriterEffect(div, text);
  } else {
    div.textContent = text;
    chatMessages.appendChild(div);
    // Trigger animation
    requestAnimationFrame(() => {
      div.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      div.style.transform = 'translateY(8px)';
      requestAnimationFrame(() => {
        div.style.opacity = '1';
        div.style.transform = 'translateY(0)';
      });
    });
    scrollToBottom();
  }
  return div;
}

// ── Typewriter for bot messages ───────────────────────────────────────────────
function typewriterEffect(el, text) {
  el.style.opacity = '1';
  el.textContent = '';
  let i = 0;
  const speed = text.length > 120 ? 12 : 18; // ms per char
  const interval = setInterval(() => {
    el.textContent += text[i];
    scrollToBottom();
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function showTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'msg msg-bot';
  div.id = 'typing-indicator';
  div.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
  div.style.animation = 'msgIn .25s ease forwards';
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

// ── API ───────────────────────────────────────────────────────────────────────
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

// ── Flow ──────────────────────────────────────────────────────────────────────
async function processMessage(text) {
  if (isWaitingResponse || !text.trim()) return;
  isWaitingResponse = true;
  addMessage(text, 'user');
  await delay(350);
  showTypingIndicator();
  try {
    const reply = await fetchBotReply(text);
    removeTypingIndicator();
    addMessage(reply, 'bot');
  } catch (err) {
    console.error('[Chatbot] Erro:', err.message);
    removeTypingIndicator();
    addMessage('Ops! Não consegui me conectar agora. Entre em contato pelo email ou LinkedIn! 📬', 'bot');
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Init ──────────────────────────────────────────────────────────────────────
function initChatbot() {
  chatPanel    = document.getElementById('chat-panel');
  chatMessages = document.getElementById('chat-messages');
  chatInput    = document.getElementById('chat-input');

  document.getElementById('chat-btn').addEventListener('click', toggleChat);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
  document.querySelector('.chat-send').addEventListener('click', sendMessage);
  document.querySelector('.chat-suggestions').addEventListener('click', e => {
    const chip = e.target.closest('.chat-sugg');
    if (chip) sendSuggestion(chip);
  });
}

document.addEventListener('DOMContentLoaded', initChatbot);
