/**
 * server.js
 * Ponto de entrada da aplicação.
 * Configura o Express, middlewares globais e inicia o servidor.
 */

'use strict';

const express = require('express');
const cors = require('cors');
const { PORT, CORS_ORIGIN, NODE_ENV } = require('./config/env');
const apiRouter = require('./routes/api');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ─── Middlewares Globais ────────────────────────────────────────────────────

// CORS: permite apenas a origem configurada no .env
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// Parse do body JSON (limite de 100kb para evitar payloads gigantes)
app.use(express.json({ limit: '100kb' }));

// Log simples de requisições em desenvolvimento
if (NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── Rotas ──────────────────────────────────────────────────────────────────

// Todas as rotas da API ficam sob /api
app.use('/api', apiRouter);

// Rota raiz — útil para verificação rápida
app.get('/', (_req, res) => {
  res.json({ message: 'Portfolio API está online 🚀' });
});

// ─── Middlewares de Erro ─────────────────────────────────────────────────────

// Rota 404 — deve vir antes do errorHandler
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// Tratamento global de erros
app.use(errorHandler);

// ─── Inicialização ───────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
  console.log(`   Ambiente: ${NODE_ENV}`);
  console.log(`   CORS permitido para: ${CORS_ORIGIN}`);
});
