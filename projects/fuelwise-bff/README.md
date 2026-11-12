# FuelWise BFF

Node 22/Express. Agrega e adapta dados, sem drivers de banco. Autenticação pelo
legado e propagação do Bearer aos serviços. URLs fixas no ambiente, timeout de
5 segundos, sem retry de mutações. POST login/refresh/logout preservam contratos.

`npm ci`; configurar `.env.example`; `npm start`; `npm test`.
`GET /aggregated-data` consulta Postos e Viagens concorrentemente e envia os
resultados à Function. HTTP 207 indica falha parcial, com null e erros explícitos.
Indicadores representam até 100 registros visíveis, não totais globais.
CRUD `/api/v1/stations`, `/api/v1/trips`; cadastros `/drivers` e `/vehicles` no
legado. Swagger `/docs`, especificação `/openapi.json`, health `/health/live`.

Docker: `docker build -t fuelwise-bff:v1 .`, porta 3003. Publicar atrás do gateway,
configurar LEGACY_URL, STATIONS_URL, TRIPS_URL, FUNCTION_URL, FUNCTION_KEY e,
opcionalmente, HTTP_TIMEOUT_MS (padrão 5000; 10000 na cloud por causa de cold start).
Cloud: Swagger em https://gateway.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs e agregação em
https://gateway.redhill-64ef7229.brazilsouth.azurecontainerapps.io/aggregated-data (via API Gateway, Bearer).
Deploy cloud: Azure Container Apps (`scripts/deploy-azure.sh` no repositório
principal); URLs em `docs/PUBLIC_URLS.md`.

Integrantes: Artur Ribeiro de Souza; Cristhian Rezende; Lucas Andriani Theiss;
Vinicius da Rosa Padilha.
