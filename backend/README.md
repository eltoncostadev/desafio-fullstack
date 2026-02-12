# Backend

API NestJS 11 responsável pelo CRUD de clientes, autenticação JWT e endpoints de observabilidade. Utiliza TypeORM com PostgreSQL e segue padrões de DTOs compartilhados com o frontend.

## Pré-requisitos
- Node.js 20+ e npm 10+
- Docker Desktop/Engine para subir PostgreSQL opcionalmente
- Dependências instaladas na raiz do monorepo (`npm install`)

## Configuração
1. Copie `backend/.env.example` para `backend/.env`.
2. Ajuste variáveis conforme seu ambiente (porta da API, credenciais do banco e segredo JWT).
3. Opcional: importe `backend/seedDB.sql` no banco para criar dados de exemplo.

## Variáveis principais
| Variável | Descrição |
| --- | --- |
| `PORT` / `API_PORT` | Porta exposta pela API (padrão 3000). |
| `DB_*` | Configurações do PostgreSQL usado pela API. |
| `AUTH_EMAIL` / `AUTH_PASSWORD` | Credenciais para o `POST /auth/login`. |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Configuração do token JWT. |
| `FRONTEND_ORIGIN` | Origem permitida para CORS. |

## Execução Docker Compose (API + PostgreSQL)
```bash
cd backend
cp .env.example .env  # se ainda não existir
sudo docker compose up --build
```
- Sobe dois serviços: `api` (NestJS) e `postgres` (dados persistidos em volume `postgres_data`).
- O container da API executa `npx nx serve backend --configuration=development` com watch ativo.

## Build
```bash
npx nx build backend
```
- Produz saída em `dist/backend` usando webpack.
- Para produção, ajuste `NODE_ENV=production` e rode `npx nx build backend --configuration=production`.

## Testes
```bash
npx nx test backend
```
- Os testes usam Jest + Supertest; `passWithNoTests` evita falhas quando não há specs.

## Endpoints úteis
- `POST /auth/login` – retorna JWT usando `AUTH_EMAIL`/`AUTH_PASSWORD`.
- `GET /clients` – lista clientes com paginação (`page`, `limit`).
- `GET /healthz` – health check HTTP simples.
- `GET /metrics` – métricas Prometheus com prefixo `client_mgmt_`.

## Observabilidade e logs
- Interceptor `logger/json-logger.service.ts` imprime logs estruturados em JSON.
- Métricas e health ficam sob módulo `observability/`.
- Ajuste exporters no futuro (Grafana, Loki) apontando para esses endpoints.