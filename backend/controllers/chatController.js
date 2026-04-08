/**
 * controllers/chatController.js
 * Processa as requisições do endpoint de chat.
 * Valida os dados de entrada e delega ao serviço de IA.
 */

'use strict';

const claudeService = require('../services/claudeService');

/**
 * POST /api/chat
 * Recebe o histórico de mensagens e retorna a resposta do assistente.
 *
 * Body esperado:
 * {
 *   "history": [
 *     { "role": "user",      "content": "Quais são suas skills?" },
 *     { "role": "assistant", "content": "Olá! Tenho experiência em..." }
 *   ]
 * }
 */
async function handleChat(req, res) {
  const { history } = req.body;

  // --- Validação de entrada ---
  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({
      error: 'O campo "history" é obrigatório e deve ser um array não vazio.',
    });
  }

  // Valida que todas as mensagens têm os campos corretos
  const isValidHistory = history.every(
    (msg) =>
      typeof msg === 'object' &&
      (msg.role === 'user' || msg.role === 'assistant') &&
      typeof msg.content === 'string' &&
      msg.content.trim().length > 0
  );

  if (!isValidHistory) {
    return res.status(400).json({
      error: 'Cada mensagem deve ter "role" (user|assistant) e "content" (string não vazia).',
    });
  }

  // Limite de segurança: máximo 50 mensagens no histórico
  const MAX_HISTORY = 50;
  const trimmedHistory = history.slice(-MAX_HISTORY);

  // --- Chamada ao serviço ---
  try {
    const reply = await claudeService.sendMessage(trimmedHistory);
    return res.json({ reply });
  } catch (err) {
    console.error('[ChatController] Erro ao chamar API:', err.message);
    return res.status(502).json({
      error: 'Não foi possível obter resposta da IA no momento. Tente novamente em instantes.',
    });
  }
}

module.exports = { handleChat };
