'use strict';

require('dotenv').config();

const REQUIRED_VARS = ['GROQ_API_KEY'];

REQUIRED_VARS.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ Variável de ambiente obrigatória ausente: ${varName}`);
    console.error('   Copie .env.example para .env e preencha os valores.');
    process.exit(1);
  }
});

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 3001,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://127.0.0.1:5500',
  NODE_ENV: process.env.NODE_ENV || 'development',
};