# FuelWise — Postos

Extração dos contratos de `src/slices/stations` do FuelWise. Node 22, Express,
Zod, driver oficial MongoDB. Features contêm HTTP e caso de uso separados;
aplicação recebe a porta de repositório; infraestrutura implementa persistência.
IDs UUID preservam compatibilidade. Desativação mantém histórico de preços.

`npm ci`, copie `.env.example` para `.env` e preencha a URI do Atlas com usuário
de banco e senha URL-encoded. Não versione `.env`. Para executar localmente:
`node --env-file=.env src/server.js`. Em Docker, passe as variáveis no ambiente.
`npm test` executa testes HTTP isolados; `TEST_MONGODB_URI` habilita teste real
em banco temporário exclusivo, removido ao final. Nunca use URI de produção
com privilégio amplo para testes. `/health/ready` verifica MongoDB.

Swagger: `/docs`; OpenAPI: `/openapi.json`. CRUD em `/api/v1/stations`.
ADMIN altera postos/preços; usuários autenticados consultam. Identidade validada
por HTTP no legado (`LEGACY_URL/api/v1/auth/me`), preservando bloqueio de conta.
Não há credencial ou perfil confiado ao navegador além do Bearer.

Docker: `docker build -t fuelwise-mongo:v1 .`; porta 3001. Injetar MONGODB_URI,
MONGODB_DATABASE e LEGACY_URL em runtime. Usar Atlas Free na demonstração;
Mongo local é apenas desenvolvimento. Cloud: Swagger em
https://stations.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs, conectado ao MongoDB Atlas M0.
Deploy cloud: Azure Container Apps (`scripts/deploy-azure.sh` no repositório
principal); URLs em `docs/PUBLIC_URLS.md`.

Integrantes: Artur Ribeiro de Souza; Cristhian Rezende; Lucas Andriani Theiss;
Vinicius da Rosa Padilha.
