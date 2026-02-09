# Desafio Full-Stack MVP

Este repositório contém um desafio técnico full-stack em formato MVP, servindo como base inicial para futuras implementações.

## Estrutura do Monorepo

- `frontend`: aplicação React com Vite e TypeScript, focada somente em layout/base do projeto.
- `backend`: serviço NestJS configurado com Webpack e Jest para testes.
- `frontend-e2e` e `backend-e2e`: projetos auxiliares gerados pelo Nx para testes automatizados (sem lógica adicional por enquanto).

## Como rodar

1. Instale as dependências: `npm install`.
2. Build frontend: `npx nx build frontend`.
3. Build backend: `npx nx build backend`.

Todos os comandos utilizam o Nx com npm seguindo os padrões recomendados. Ainda não há lógica de negócio implementada; as aplicações servem como base para as próximas etapas do desafio.

## Docker (backend)

O diretório `backend/` contém um `docker-compose.yml` simples com a API NestJS e um PostgreSQL local.

1. Entre na pasta: `cd backend`.
2. Copie o arquivo de variáveis: `cp .env.example .env` (ajuste valores conforme necessário).
3. Suba os serviços: `docker compose up --build`.

O serviço `api` executa `npx nx serve backend` expondo a porta `3000`, enquanto o serviço `postgres` reutiliza as mesmas variáveis definidas no `.env` para manter os valores centralizados.

## Docker (frontend)

O diretório `frontend/` possui um `docker-compose.yml` simples para rodar o Vite com hot reload.

1. Entre na pasta: `cd frontend`.
2. Copie as variáveis padrão: `cp .env.example .env` (mantenha `VITE_APP_PORT=5173` ou escolha outra porta livre).
3. Suba o container: `docker compose up --build`.

O serviço `web` utiliza `npm run dev -- --host 0.0.0.0` para expor a porta 5173 no host, montando o diretório raiz em modo bind para preservar o hot reload.
