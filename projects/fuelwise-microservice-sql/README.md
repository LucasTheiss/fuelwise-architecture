# FuelWise — Viagens

Node 22/Express/Zod/mssql. Reaproveita estados e regras de viagens do legado:
motorista/veículo da mesma transportadora, exclusividade de viagem ativa,
isolamento e bloqueio da finalização com abastecimentos pendentes. Edição muda
somente observações; DELETE desativa viagens finalizadas, preservando auditoria.
Cancelamento não foi introduzido porque não existe no domínio original.

`npm ci`; copie `.env.example` para `.env` e preencha as credenciais localmente.
Não versione `.env`. Rode a migration com
`node --env-file=.env scripts/migrate.js` e inicie a API com
`node --env-file=.env src/server.js`.
Migration aditiva/idempotente, TLS obrigatório no Azure, pool máximo de três.
`SQL_LOCAL_DEVELOPMENT=true` aceita certificado local somente fora de produção.
O serviço nunca acessa PostgreSQL: valida identidade/frota/pendências por HTTP.

`npm test` testa regras e HTTP isolados. Testes com SQL real devem ser habilitados
em banco exclusivo de homologação. `/docs` Swagger, `/openapi.json`,
`/health/live`, `/health/ready`; CRUD `/api/v1/trips`, PATCH `/:id/finish`.
Viagem e outbox são gravados na mesma transação; worker processa eventos depois.

Docker: `docker build -t fuelwise-sql:v1 .`, porta 3002; configurar variáveis
AZURE_SQL_* e LEGACY_URL. Azure SQL real é obrigatório na demonstração pública;
SQL Server local só auxilia desenvolvimento. Cloud: Swagger em
https://trips.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs, conectado ao Azure SQL `fuelwiseDB` (oferta Free).
Deploy cloud: Azure Container Apps (`scripts/deploy-azure.sh` no repositório
principal); URLs em `docs/PUBLIC_URLS.md`.

Integrantes: Artur Ribeiro de Souza; Cristhian Rezende; Lucas Andriani Theiss;
Vinicius da Rosa Padilha.
