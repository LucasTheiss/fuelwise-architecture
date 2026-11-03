# FuelWise — Postos

Extração dos contratos de `src/slices/stations` do FuelWise. Node 22, Express,
Zod, driver oficial MongoDB. Features contêm HTTP e caso de uso separados;
aplicação recebe a porta de repositório; infraestrutura implementa persistência.
IDs UUID preservam compatibilidade. Desativação mantém histórico de preços.

`npm ci`, configure as variáveis de `.env.example` no ambiente, `npm start`.
Para carregar um arquivo: `node --env-file=.env src/server.js`.
`npm test` executa testes HTTP isolados; `TEST_MONGODB_URI` habilita teste real
em banco temporário exclusivo, removido ao final. Nunca use URI de produção
com privilégio amplo para testes. `/health/ready` verifica MongoDB.

Swagger: `/docs`; OpenAPI: `/openapi.json`. CRUD em `/api/v1/stations`.
ADMIN altera postos/preços; usuários autenticados consultam. Identidade validada
por HTTP no legado (`LEGACY_URL/api/v1/auth/me`), preservando bloqueio de conta.
Não há credencial ou perfil confiado ao navegador além do Bearer.

Docker: `docker build -t fuelwise-mongo:v1 .`; porta 3001. Injetar MONGODB_URI,
MONGODB_DATABASE e LEGACY_URL em runtime. Usar Atlas Free na demonstração;
Mongo local é apenas desenvolvimento. Deploy público pendente de credenciais e
verificação de custos. Nenhuma URL pública criada.

Integrantes: Artur Ribeiro de Souza; Cristhian Rezende; Lucas Andriani Theiss;
Vinicius da Rosa Padilha.
