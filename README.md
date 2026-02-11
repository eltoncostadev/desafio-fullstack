# Desafio Full-Stack MVP

Sou o Tech Manager responsável por esta entrega e reuni abaixo o que você precisa saber para operar, evoluir e escalar o projeto com confiança.

## Visão Geral
- **Objetivo**: disponibilizar um console administrativo onde squads podem consultar clientes, acompanhar métricas e manter o cadastro sempre válido.
- **Formato**: monorepo Nx com aplicações React (frontend) e NestJS (backend).
- **Foco atual**: CRUD de clientes com paginação, autenticação JWT, métricas Prometheus e UX responsiva.

## Arquitetura
```
┌──────────────┐        HTTPS         ┌────────────────────┐
│  Frontend    │  ───────────────▶   │  Backend (NestJS)  │
│  React/Vite  │ ◀───────────────┐   │  REST + Swagger    │
└──────────────┘    Auth Token   │   └────────┬──────────┘
        ▲                            TypeORM   │
        │                                        
        │                         ┌─────────────▼────────────┐
        │                         │ PostgreSQL (Docker local)│
        │                         └─────────────▲────────────┘
        │                                       │
        │          Observability (JSON logs, Prometheus, health checks)
        └───────────────────────Nx Monorepo Tooling───────────────────────
```
- **Front** serve o SPA via Vite e consome a API autenticada. Usa hooks centralizados (`useApi`, `useAuth`) para manter políticas de rede e sessão consistentes.
- **Back** expõe rotas REST no NestJS, com TypeORM para persistência e DTOs para contratos estáveis. Paginação e validações seguem padrões consistentes entre camadas.
- **Infra local** utiliza Docker Compose separado para frontend e backend, permitindo subir API + PostgreSQL ou apenas o Vite Dev Server conforme necessidade.

## Decisões Tecnológicas
| Camada | Stack | Motivo da escolha |
| --- | --- | --- |
| Build/Workspace | Nx 22 + TypeScript | Orquestra builds/testes num único grafo, facilita cache e padroniza scripts.
| Frontend | React 19, Vite, CSS Modules | Renderização rápida, DX moderna e isolamento de estilos sem dependência de frameworks pesados.
| Backend | NestJS 11, TypeORM, class-validator | Fornece arquitetura modular, injeção de dependência nativa e integração direta com PostgreSQL/DTOs.
| Autenticação | JWT + Auth Guard customizado | Mantém o backend stateless e pronta para escalar horizontalmente.
| Observabilidade | JSON logs, `/metrics` Prometheus, `/healthz` | Facilita scraping em plataformas como Grafana/Loki e health checks em orquestradores.
| Testes | Vitest + Testing Library, Jest + Supertest | Cobertura unitária rápida no front e no back, com mocks controlados e fixtures simples.

## Como Executar
1. **Instalação** (raiz): `npm install`
2. **Frontend Dev**: `npx nx dev frontend` (ou `docker compose up --build` dentro de `frontend/`)
3. **Backend Dev**: `npx nx serve backend` (ou `docker compose up --build` dentro de `backend/` para subir API + PostgreSQL)
4. **Build**: `npx nx build frontend` / `npx nx build backend`
5. **Testes**: `npx nx test frontend` / `npx nx test backend`

> Copie os arquivos `.env.example` de cada app para `.env` antes de subir os serviços. O Swagger fica em `http://localhost:3000/docs` e requer Bearer token obtido via `POST /auth/login` usando `AUTH_EMAIL`/`AUTH_PASSWORD` definidos no backend.

## Escalabilidade
- **Horizontabilidade**: a API é stateless (JWT + TypeORM) e pode ser replicada atrás de um load balancer sem sessão compartilhada.
- **Paginação e filtros**: endpoints `/clients` já suportam `page` e `limit`; próximos filtros devem respeitar o mesmo DTO para manter índices eficientes.
- **Banco**: migrações futuras podem ser gerenciadas com TypeORM CLI ou Nx executors. Considere read replicas quando o volume de relatórios crescer.
- **Cache e fila**: camada de cache (Redis) pode ser introduzida para dashboards e fila (BullMQ) para tarefas intensivas como relatórios em lote.

## Observabilidade
- **Logs**: toda requisição HTTP sai em JSON estruturado. Plug-and-play com Fluent Bit/Loki.
- **Health**: `GET /healthz` retorna `status` e `timestamp`, suportando probes HTTP.
- **Métricas**: `GET /metrics` expõe contadores e histograms com prefixo `client_mgmt_`, prontos para Prometheus.
- **Alertas**: recomendo acoplar limites (p95 de resposta, erros 5xx) em Grafana/Alertmanager quando for para produção.

## Melhorias Planejadas
1. **Autorização avançada**: perfis/grupos para liberar apenas módulos necessários por usuário.
2. **Auditoria**: trilhas de alteração de clientes com exportação para SIEM.
3. **Resiliência**: implementar circuit breaker e retry para integrações externas futuras.
4. **Acessibilidade**: reforçar testes de teclado/aria no frontend.
5. **CI/CD**: pipeline automatizado com Nx Cloud para cache distribuído e testes paralelos.

Mantenha este README como ponto único de referência para novos integrantes. Qualquer ajuste de arquitetura ou padrão deve ser refletido aqui para garantir alinhamento entre squads.
