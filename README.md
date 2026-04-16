# Felipe — Portfólio v2

Site de portfólio pessoal com chatbot integrado via IA, arquitetura full-stack e deploy em produção.

🔗 **[https://limaxx.space](https://limaxx.space)**

---

## Sobre o projeto

Portfólio desenvolvido do zero com foco em apresentar minha trajetória, projetos e habilidades na área de tecnologia. O diferencial desta versão é a integração de um assistente virtual com IA que responde perguntas sobre minha carreira em tempo real, com arquitetura separada entre frontend e backend — cada um com seu próprio deploy em produção.

---

## Funcionalidades

- Apresentação de projetos, skills e experiência
- Efeito de digitação animado na seção hero
- Scroll reveal nos elementos da página
- Chatbot com IA integrada (Groq API + LLaMA 3)
- Design responsivo para mobile e desktop
- Navegação mobile com menu hambúrguer
- Abas de skills por categoria

---

## Arquitetura

```
portfolio-v2/
├── frontend/
│   ├── index.html       # Estrutura e estilos do site
│   ├── ui.js            # Animações e interações da interface
│   └── chatbot.js       # Lógica do chat e comunicação com o backend
│
└── backend/
    ├── server.js                      # Ponto de entrada — Express + middlewares
    ├── config/
    │   └── env.js                     # Validação de variáveis de ambiente
    ├── controllers/
    │   └── chatController.js          # Handler do endpoint de chat
    ├── middleware/
    │   └── errorHandler.js            # Tratamento global de erros
    ├── routes/
    │   └── api.js                     # Definição das rotas da API
    └── services/
    └── claudeService.js   # Integração com a API do Groq (LLaMA 3).
                           # O arquivo mantém o nome original "claudeService"
                           # pois foi criado durante o desenvolvimento com a
                           # API da Anthropic (Claude). Ao descobrir que era
                           # paga, a integração foi migrada para o Groq,
                           # que oferece acesso gratuito ao LLaMA 3.
```

---

## Stack

**Frontend**
- HTML5, CSS3, JavaScript puro (sem frameworks)
- Deploy: Vercel

**Backend**
- Node.js + Express 4
- Groq SDK (LLaMA 3.3 70B)
- Deploy: Railway

**Ferramentas**
- Git & GitHub para versionamento
- Nodemon para desenvolvimento local
- CORS configurado por ambiente

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Conta no [Groq](https://console.groq.com) para obter a API key (gratuito)
- Extensão Live Server no VS Code (para o frontend)

### Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
GROQ_API_KEY=sua_chave_aqui
CORS_ORIGIN=http://127.0.0.1:5500
NODE_ENV=development
PORT=3001
```

```bash
# Rode o servidor
npm run dev
```

O backend estará disponível em `http://localhost:3001`.

### Frontend

Abra o `frontend/index.html` com o **Live Server** do VS Code. O site estará disponível em `http://127.0.0.1:5500`.

---

## Deploy em produção

| Parte | Plataforma | URL |
|---|---|---|
| Frontend | Vercel | portfolio-v2-one-tan-53.vercel.app |
| Backend | Railway | portfolio-v2-production-895e.up.railway.app |

### Variáveis de ambiente no Railway

```env
GROQ_API_KEY=sua_chave_aqui
CORS_ORIGIN=https://portfolio-v2-one-tan-53.vercel.app
NODE_ENV=production
PORT=3001
```

---

## API

### POST /api/chat

Recebe o histórico da conversa e retorna a resposta do assistente.

**Body:**
```json
{
  "history": [
    { "role": "user", "content": "Quais são suas skills?" }
  ]
}
```

**Resposta:**
```json
{
  "reply": "Felipe tem experiência com HTML, CSS, JavaScript..."
}
```

---

## Contato

- GitHub: [github.com/pkeddits](https://github.com/pkeddits)
- LinkedIn: [linkedin.com/in/felipe](https://linkedin.com/in/felipe)

---

*Desenvolvido com HTML, CSS & JavaScript — 2025*
