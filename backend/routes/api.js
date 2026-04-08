/**
 * routes/api.js
 * Define todas as rotas da API.
 * Cada rota é conectada ao seu controller correspondente.
 */

'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const { handleChat } = require('../controllers/chatController');

const router = express.Router();

/**
 * Rate limiter específico para o chat:
 * Máximo 30 requisições por IP a cada 1 minuto.
 * Protege contra abuso da API key.
 */
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Muitas mensagens enviadas. Aguarde um momento antes de continuar.',
  },
});

// POST /api/chat — Endpoint principal do chatbot
router.post('/chat', chatLimiter, handleChat);

// GET /api/health — Verificação de saúde do servidor
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
