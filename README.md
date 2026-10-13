# FuelWise Backend — Node.js / Vertical Slice / SOLID

Backend REST em **Node.js 22 (JavaScript ESM)**, Express, Zod e PostgreSQL 16, derivado dos 16 requisitos funcionais do PDF de arquitetura e do modelo de domínio fornecidos. É o **mesmo projeto anterior**, agora com os nomes de diretórios, arquivos, endpoints, entidades, tabelas, colunas e enums em **inglês**. Na aplicação JavaScript, payloads usam `camelCase`; no PostgreSQL, colunas usam `snake_case`. Documentação funcional permanece em português.

**Ambiente previsto: homologação local com PostgreSQL real e os quatro serviços externos simulados. Não é um gateway financeiro real.**

## Rodar com o mínimo de configuração (Docker)

Um `.env` **já preenchido** é fornecido no ZIP com **quatro configurações de banco/JWT/admin + `INTEGRATION_MODE=mock`**. Nenhuma credencial de Firebase, GPS, serviço de postos ou provedor de pagamentos é necessária.

Pré-requisito: Docker Desktop com Compose, engine iniciado e porta 3000 disponível (porta 5432 se o banco for acessado pelo host).

```bash
docker compose up -d --build
```

O Compose faz automaticamente, nesta ordem:

1. PostgreSQL 16 (`db`) com volume persistente.
2. Migration `database/migrations/001_initial.sql` e criação do administrador (`init`). O seed é idempotente, sem sobrescrever a senha de um administrador existente.
3. Servidor Express (`api`) e worker de notificações (mock).

Endereços: `http://localhost:3000/health/live`, `http://localhost:3000/health/ready`, API `http://localhost:3000/api/v1`.

O banco externo no host é `postgresql://fuelwise:fuelwise_dev@localhost:5432/fuelwise`; **dentro do Compose**, o host passa a ser `db` automaticamente.

**Credenciais de homologação presentes no `.env`:** `admin@fuelwise.local` / `LocalTest@2026!`. Altere a senha e o segredo JWT antes de compartilhar o projeto ou publicar o servidor. Esses valores não são adequados para produção. O `.env` está excluído pelo `.gitignore`, mas foi incluído intencionalmente **no ZIP**.

Para interromper: `docker compose down`. Para apagar os dados e recomeçar do zero: `docker compose down -v` (**apaga todos os dados**, inclusive a senha previamente cadastrada).

### Alternativa: Node diretamente no host

```bash
docker compose up -d db
npm install
npm run db:migrate
npm run db:seed:admin
npm run dev
```

Este caminho usa o `DATABASE_URL=...@localhost:5432/...` existente no `.env`.

## Configuração mínima

| Variável | Necessária? | Observação |
|---|---|---|
| `DATABASE_URL` | Sim | PostgreSQL real. Substituído automaticamente pelo Compose nos containers. |
| `JWT_SECRET` | Sim | Mínimo de 32 caracteres. Valor de homologação já presente no `.env`. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Para seed inicial | Conta ADMIN criada automaticamente pelo Compose. |
| `ADMIN_NAME` | Opcional | Nome do administrador. |
| `INTEGRATION_MODE=mock` | Recomendado | Habilita GPS, postos externos e Firebase simulados; pagamento usa `mock` automaticamente. |
| `NODE_ENV`, `PORT` | Opcionais | Defaults: `development`, `3000`. |

Outras opções já têm defaults: JWT TTL, CORS, timeouts e SSL do banco. Consulte `src/shared/config.js` para substituir por integrações externas reais. **Modo mock é bloqueado quando `NODE_ENV=production`.**

## Quais integrações estão simuladas?

| Serviço | Resultado em homologação |
|---|---|
| Gateway de pagamento | `APPROVED` e identificador `MOCK-{paymentId}`. O fluxo **não movimenta dinheiro**; idempotência e persistência funcionam no PostgreSQL. |
| GPS | Retorna uma **coordenada fixa de demonstração** na região de Curitiba, com `origin: "MOCK"` e `simulated: true`. **Não rastreia um veículo real.** |
| API de postos externos | Lista dois registros explicitamente fictícios, com `origin: "MOCK"`. Os postos externos simulados **não são persistidos**; para abastecimento, cadastre um posto pelo endpoint local. |
| Firebase Cloud Messaging | Registra notificações no outbox do PostgreSQL como `SIMULATED` e permite listá-las pela API, **sem enviar push real**. |

Para usar integrações reais, configure `INTEGRATION_MODE=live`, `PAYMENT_PROVIDER=http`, `PAYMENT_API_URL`, `PAYMENT_API_KEY`, `PAYMENT_SUPPORTS_IDEMPOTENCY=true`, `GPS_API_URL`, `STATIONS_API_URL` e variáveis FCM, conforme os contratos de `docs/DECISIONS.md`. **Os provedores comerciais e seus endpoints reais não foram definidos na documentação original**; os adaptadores HTTP são contratos de referência que precisam ser ajustados ao fornecedor.

## Organização: um slice por caso de uso

```text
fuelwise-backend/
├── .env                        # homologação: preenchido
├── .env.example                # template sem segredo
├── compose.yaml
├── Dockerfile
├── database/
│   └── migrations/
│       └── 001_initial.sql     # tabelas e campos em inglês
├── docs/
│   ├── API.md
│   ├── REQUIREMENTS.md
│   ├── DECISIONS.md
│   └── references/
├── scripts/
│   ├── migrate.js
│   ├── seed-admin.js
│   ├── check-syntax.js
│   └── start-local.sh
├── src/
│   ├── app.js                  # composition root / injeção de dependências
│   ├── server.js
│   ├── shared/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── http/
│   │   ├── integrations/       # mocks, adapters reais, interfaces pequenas
│   │   ├── notifications/
│   │   └── utils/
│   └── slices/
│       ├── auth/{login,logout,me,refresh,register-carrier}/
│       ├── carriers/{decide,list-pending}/
│       ├── drivers/{create,list}/
│       ├── vehicles/{create,list,location}/
│       ├── trips/{start,list,finish}/
│       ├── stations/{create,list,detail,prices,add-price,external}/
│       ├── fuelings/{create,list,approve}/
│       ├── payments/{pay,get,reconcile}/
│       ├── analytics/{audit,consumption}/
│       ├── complaints/{create,list,moderate}/
│       └── notifications/{list,register-token}/
└── tests/
```

Em cada slice: `route.js` declara HTTP/RBAC/validação, `useCase.js` implementa o fluxo, e `repository.js` existe quando separação de persistência é particularmente necessária. O gateway e provedores são substituíveis por adapters, sem alterar casos de uso. A divisão é por **funcionalidade**, não por pastas globais `controllers/services/repositories`.

## Primeiro fluxo funcional

1. `POST /api/v1/auth/login` com admin de homologação; obter `accessToken`.
2. `POST /api/v1/carriers/requests` cria transportadora e manager (`PENDING`).
3. Admin consulta `GET /api/v1/admin/carriers/requests`, aprova `PATCH /api/v1/admin/carriers/{id}/decision` com `{"decision":"APPROVE"}`.
4. Manager faz login, cria driver/vehicle e inicia trip.
5. Admin cadastra station e fuel price **reais no banco local**.
6. Driver cria fueling; manager aprova; driver paga; a resposta será `APPROVED` **simulada**.
7. Consulte relatórios, auditoria, reclamações e notifications.

Corpos JSON, permissões e exemplos: [`docs/API.md`](docs/API.md). Mapeamento RF01–RF16: [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md).

## Integridade e limites

- Isolamento por transportadora no SQL, RBAC ADMIN/MANAGER/DRIVER, JWT + refresh token rotativo, `bcrypt` para senhas.
- Índices únicos para viagem simultânea por motorista/veículo, pagamento único por abastecimento, denúncia sobre **um único alvo**, e histórico de preços.
- Pagamento tem registro `PROCESSING` persistido **antes** de cobrar; erros de rede não são falsamente convertidos em recusa, e requerem conciliação.
- GPS com fallback para último dado salvo, notificação via outbox, validação com Zod, logs JSON e mensagens de erro sem vazamento de detalhes internos.
- Requisitos de performance (p95 ≤ 2s), disponibilidade e operação financeira **não foram homologados**. Testes unitários não substituem E2E com PostgreSQL e contratos reais.

### Testes

```bash
npm run check
npm test
```

O ambiente utilizado para construir este ZIP não conseguiu instalar pacotes npm nem executar Docker. Foram validados scripts com `node --check` e testes unitários executáveis sem dependências externas; inicialização completa deverá ser verificada no ambiente de homologação com Docker. Não confunda mocks funcionais com integração homologada.
