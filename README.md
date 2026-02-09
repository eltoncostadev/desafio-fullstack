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
