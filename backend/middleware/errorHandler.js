/**
 * middleware/errorHandler.js
 * Middleware global de tratamento de erros.
 * Captura exceções não tratadas e retorna resposta JSON padronizada.
 */

'use strict';

const { NODE_ENV } = require('../config/env');

/**
 * Middleware de erro do Express (4 parâmetros obrigatórios).
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[ErrorHandler]', err);

  const statusCode = err.statusCode || err.status || 500;

  const response = {
    error: err.message || 'Erro interno do servidor.',
  };

  // Em desenvolvimento, inclui a stack trace para facilitar debug
  if (NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = { errorHandler };
