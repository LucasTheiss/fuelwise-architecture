# FuelWise — Azure Function HTTP

Node 22, programming model v4 (`app.http`), gatilho POST `/api/indicators`,
`authLevel=function`. Calcula postos, viagens ativas/concluídas e totais da
amostra enviada pelo BFF; não acessa bancos. null representa serviço ausente.

`npm ci`; `npm test`; `npm start` usa Azure Functions Core Tools v4.
Criar `local.settings.json` não versionado com `IsEncrypted:false`, `Values`
contendo FUNCTIONS_WORKER_RUNTIME=node e AzureWebJobsStorage apropriado.
Alternativa de desenvolvimento: `npm run dev` usa o mesmo handler em Node HTTP,
sem simular o runtime Azure. Não é evidência de implantação de Azure Functions.

OpenAPI em `openapi.json`. Configurar FUNCTION_URL e FUNCTION_KEY no BFF.
Cloud: https://function.redhill-64ef7229.brazilsouth.azurecontainerapps.io/api/indicators (POST, header
`x-functions-key`). Roda no host oficial Azure Functions Node 22 (imagem
`cristhiansk/fuelwise-function:v1`, `Dockerfile.runtime`) no Azure Container
Apps, com chaves em arquivo e sem Storage Account. Alternativa com Function App:
`func azure functionapp publish NOME` (exige Storage, cobrado à parte).
Deploy cloud: Azure Container Apps (`scripts/deploy-azure.sh` no repositório
principal); URLs em `docs/PUBLIC_URLS.md`.

No repositório principal, `Dockerfile.runtime` e `compose.functions-runtime.yaml`
executam o host oficial Node 22 com Azurite local. Gerar chaves descartáveis com
`node scripts/prepare-function-runtime.mjs`, iniciar com os dois arquivos Compose
e executar `node scripts/test-function-runtime.mjs`. O teste exige 401 sem chave,
200 com chave válida e 400 em entradas inválidas. Instruções em
`docs/DEPLOYMENT.md` do repositório principal. Não equivale a deploy Azure.

Integrantes: Artur Ribeiro de Souza; Cristhian Rezende; Lucas Andriani Theiss;
Vinicius da Rosa Padilha.
