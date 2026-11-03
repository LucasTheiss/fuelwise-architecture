# FuelWise — Viagens

Node 22/Express/Zod/mssql. Reaproveita estados e regras de viagens do legado:
motorista/veículo da mesma transportadora, exclusividade de viagem ativa,
isolamento e bloqueio da finalização com abastecimentos pendentes. Edição muda
somente observações; DELETE desativa viagens finalizadas, preservando auditoria.
Cancelamento não foi introduzido porque não existe no domínio original.

`npm ci`; configurar `.env.example` no ambiente; `npm run db:migrate`; `npm start`.
Migration aditiva/idempotente, TLS obrigatório no Azure, pool máximo de três.
`SQL_LOCAL_DEVELOPMENT=true` aceita certificado local somente fora de produção.
O serviço nunca acessa PostgreSQL: valida identidade/frota/pendências por HTTP.

`npm test` testa regras e HTTP isolados. Testes com SQL real devem ser habilitados
em banco exclusivo de homologação. `/docs` Swagger, `/openapi.json`,
`/health/live`, `/health/ready`; CRUD `/api/v1/trips`, PATCH `/:id/finish`.
Viagem e outbox são gravados na mesma transação; worker processa eventos depois.

Docker: `docker build -t fuelwise-sql:v1 .`, porta 3002; configurar variáveis
AZURE_SQL_* e LEGACY_URL. Azure SQL real é obrigatório na demonstração pública;
SQL Server local só auxilia desenvolvimento. Deploy/URLs pendentes de acesso e
confirmação de gratuidade. Não há provisionamento automático.

Integrantes: Artur Ribeiro de Souza; Cristhian Rezende; Lucas Andriani Theiss;
Vinicius da Rosa Padilha.
