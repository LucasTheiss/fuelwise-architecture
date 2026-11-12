# Links da entrega

Verificados em 12/11/2026. Domínio do ambiente Azure Container Apps:
`redhill-64ef7229.brazilsouth.azurecontainerapps.io`.

## Execução cloud (HTTPS)

| Artefato | URL |
|---|---|
| Frontend (microfrontend React) | https://frontend.redhill-64ef7229.brazilsouth.azurecontainerapps.io |
| API Gateway | https://gateway.redhill-64ef7229.brazilsouth.azurecontainerapps.io |
| Swagger BFF (via gateway) | https://gateway.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs |
| Swagger Microservice Mongo (Postos) | https://stations.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs |
| Swagger Microservice SQL (Viagens) | https://trips.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs |
| Azure Function HTTP | https://function.redhill-64ef7229.brazilsouth.azurecontainerapps.io/api/indicators (POST, header `x-functions-key`) |
| Agregação BFF | https://gateway.redhill-64ef7229.brazilsouth.azurecontainerapps.io/aggregated-data (Bearer) |
| Eventos | AsyncAPI: https://github.com/LucasTheiss/fuelwise-architecture/blob/vertical-slice/docs/asyncapi.json · auditoria: https://gateway.redhill-64ef7229.brazilsouth.azurecontainerapps.io/api/v1/events (Bearer) |
| YouTube não listado | Vídeo gravado pelo grupo; incluir o link aqui e no ARC42 |

Os apps escalam a zero. A primeira requisição após inatividade pode levar até
~1 min (cold start e retomada do Azure SQL serverless).

## Código e imagens

| Artefato | URL |
|---|---|
| GitHub original | https://github.com/LucasTheiss/fuelwise-architecture/tree/vertical-slice |
| GitHub frontend | https://github.com/CristhianSK/fuelwise-frontend |
| GitHub BFF | https://github.com/CristhianSK/fuelwise-bff |
| GitHub Mongo | https://github.com/CristhianSK/fuelwise-microservice-mongo |
| GitHub SQL | https://github.com/CristhianSK/fuelwise-microservice-sql |
| GitHub Function | https://github.com/CristhianSK/fuelwise-azure-function |
| Docker Hub BFF | https://hub.docker.com/r/cristhiansk/fuelwise-bff/tags (v1) |
| Docker Hub Mongo | https://hub.docker.com/r/cristhiansk/fuelwise-mongo-service/tags (v1) |
| Docker Hub SQL | https://hub.docker.com/r/cristhiansk/fuelwise-sql-service/tags (v1) |
| Docker Hub Gateway | https://hub.docker.com/r/cristhiansk/fuelwise-gateway/tags (v1) |
| Docker Hub Function | https://hub.docker.com/r/cristhiansk/fuelwise-function/tags (v1, host oficial Azure Functions) |
| Docker Hub Frontend | https://hub.docker.com/r/cristhiansk/fuelwise-frontend/tags (v1) |
| Docker Hub Legado (cloud) | https://hub.docker.com/r/cristhiansk/fuelwise-legacy-cloud/tags (v1, API + PostgreSQL efêmero) |

Publicação dos cinco repositórios verificada em 11/11/2026 por consultas
anônimas às APIs do GitHub e Docker Hub. O histórico dos projetos foi
inspecionado com Gitleaks v8.30.1 (nenhum segredo detectado) antes da exportação
com git subtree. Prints da execução cloud: `docs/evidence/cloud/`.
