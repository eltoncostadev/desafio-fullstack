# Frontend

Console administrativo construído com React 19, Vite 7 e Nx. Esta app renderiza o painel de clientes, consome a API autenticada via JWT e expõe componentes modulares organizados em `src/features`.

## Pré-requisitos
- Node.js 20+ e npm 10+ (mesma versão usada nas imagens Docker)
- Dependências instaladas na raiz do monorepo: `npm install`

## Configuração
1. Copie `frontend/.env.example` para `frontend/.env`.
2. Ajuste as variáveis conforme necessário (veja tabela abaixo).
3. Rode `npm install` na raiz sempre que atualizar dependências.

| Variável | Descrição |
| --- | --- |
| `VITE_API_URL` | URL base da API (inclua `/api`). |
| `VITE_APP_PORT` | Porta exposta quando usar Docker Compose (padrão 5173). |

## Execução Docker Compose
```bash
cd frontend
cp .env.example .env  # se ainda não existir
sudo docker compose up --build
```
- O serviço expõe `VITE_APP_PORT` (5173 por padrão) e injeta variáveis do `.env`.
- A pasta do repositório é montada via volume, então hot reload continua funcionando.

## Build
```bash
npx nx build frontend
```
Gera artefatos em `dist/frontend`, prontos para serem servidos por CDN/reverse proxy.

## Testes
```bash
npx nx test frontend
```
Executa Vitest + Testing Library com ambiente `jsdom`.

## Estrutura rápida
- `src/app` – bootstrap do React Router e provedores globais.
- `src/features/clients` – página de listagem, paginação e formulários.
- `src/shared` – hooks (`useApi`, `useAuth`), contexto de autenticação e cliente HTTP.
- `src/assets` – ícones/imagens estáticas.