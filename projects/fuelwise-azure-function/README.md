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
Publicação preparada: `func azure functionapp publish NOME_JA_APROVADO`.
Não criar Function App/storage sem verificar custo e elegibilidade. Não há URL
pública nem recurso provisionado. Docker não é obrigatório para esta Function.

Integrantes: Artur Ribeiro de Souza; Cristhian Rezende; Lucas Andriani Theiss;
Vinicius da Rosa Padilha.
