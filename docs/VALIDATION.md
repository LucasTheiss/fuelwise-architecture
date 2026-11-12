# Validação executada — 03 e 04/11/2026

## Ambiente

Windows, Node 22.22.0 portátil em `tmp/` (não versionado), Docker Desktop,
MongoDB 7 e SQL Server 2022 Developer locais; PostgreSQL 16 para identidade
legada. Nenhum banco cloud, recurso pago ou repositório remoto criado.

## Resultados

| Verificação | Resultado observado |
|---|---|
| Baseline antes das alterações | 37/38 testes; falha apenas no nome do PDF recebido |
| Legado + arquitetura distribuída | 40 testes aprovados (38 anteriores + 2 de fronteiras/ciclos) |
| Mongo isolado | CRUD HTTP, validação e RBAC aprovados |
| Mongo real local | Mesmo CRUD executado com driver Mongo e banco temporário: aprovado |
| SQL isolado | Regras/HTTP, normalização UUID, publicação/ack/retry: 5 aprovados |
| SQL real local | CRUD, concorrência, isolamento, rollback do outbox e deduplicação: aprovado |
| BFF | 4 testes aprovados: agregação, parcial, 401 e timeout |
| Function | 3 testes aprovados: indicadores, null/vazio e validação |
| Gateway | Roteamento, CORS e limite: aprovado |
| Frontend | 3 builds separados e teste de fronteiras aprovados |
| Docker | Imagens construídas e stack local iniciado; health de APIs/bancos/gateway saudável |
| Smoke distribuído | Identidade, posto/preços CRUD, viagem CRUD/finalização, exclusividade, agregação e consumo TripCreated: PASS |
| Navegador Edge headless | Login ADMIN/MANAGER, criar posto/viagem, finalizar viagem, dashboard e Swagger BFF; sem pageerror |

`node scripts/validate-all.mjs`: 55 testes aprovados, dois testes de banco
ignorados no host sem variáveis. Esses dois foram executados separadamente nos
containers com bancos reais (Mongo e SQL). Não confundir skip do host com falta
de validação local, nem validação local com homologação Atlas/Azure.

## Falhas encontradas e corrigidas

- Convenção de nomes aplicada ao documento de entrada: preservado o nome original,
  com exceção restrita a docs/codex no teste.
- Dependências `file:../..` adicionadas pelo npm --prefix: removidas; lockfiles
  regenerados no diretório correto e builds independentes executados.
- Porta Windows 8080 indisponível: gateway publicado somente em loopback 18080.
- UUIDs SQL em maiúsculas: comparação canônica, coberta por regressão.
- Ordem de teardown do teste SQL: conexão encerrada depois da limpeza.

## Pendências que impedem aceite cloud completo

Atlas Free e Azure SQL gratuitos reais; implantação Azure Functions;
HTTPS público; testes de custo/quotas; publicação dos cinco GitHub e três imagens;
screenshots cloud; vídeo não listado com os quatro integrantes. CI foi preparado,
mas não foi executado no GitHub porque não houve push.

Financeiro/GPS/denúncias de entidades novas não foram migrados: execução original
é preservada. Corte sobre banco legado preenchido é deliberadamente bloqueado.
Testes de carga, SLA, recuperação de desastre e auditoria de segurança pendentes.

## Retomada de 04/11/2026

Estado inicial: Git limpo, HEAD ddf94a8 já contendo documentação/PDF/evidências.
Nenhuma alteração pendente perdida. Requisitos e PDF original relidos.

- Host oficial Azure Functions v4 com Node 22, via Dockerfile.runtime: aprovado.
- Azurite local fornece storage sem conta Azure; chaves locais não versionadas.
- HTTP: 401 sem chave e com chave errada; 200 com indicadores; 400 com JSON/status
  inválidos; null preservado em indisponibilidade parcial.
- Smoke completo pelo Gateway/BFF consumindo esse host: aprovado.
- Zod atualizado para 4.6.7 por GHSA-mrhx-c7xc-m3w5 em quatro projetos. npm audit
  reportou zero vulnerabilidades nesses projetos após a atualização.
- Regressão: 55 testes passaram; dois testes com banco ignorados no host foram
  novamente executados com sucesso nos containers Mongo/SQL.
- Checagem sintática: 180 arquivos, zero erros; imagens reconstruídas com sucesso.

CI preparado para repetir host oficial e smoke; execução remota depende de push.
Core Tools no Windows não foi executado. O host Docker é runtime real local,
mas não substitui Atlas, Azure SQL ou Function hospedados exigidos no aceite final.

## Homologação com os bancos cloud — 11/11/2026

- `scripts/validate-all.mjs`: passou com acesso ao Docker/loopback; os testes de
  banco condicionais foram executados separadamente contra os serviços cloud.
- MongoDB Atlas M0 real: `tests/crud.test.js` passou 2/2, incluindo CRUD,
  validação e RBAC com banco temporário exclusivo; o teardown removeu o banco.
- Azure SQL real: `tests/sql.integration.test.js` passou 1/1, incluindo CRUD,
  concorrência, isolamento por tenant, outbox e deduplicação; o teardown removeu
  os registros do teste.
- Smoke de ponta a ponta passou usando o Gateway e BFF, os microservices ligados
  aos dois bancos reais, o host oficial Azure Functions v4/Node 22 em Docker com
  Azurite local e o consumidor de eventos no Azure SQL. O fluxo cobriu identidade,
  postos/preços, viagens/transições, `/aggregated-data`, Function e `TripCreated`.
  Os dados exatos do smoke (posto/preço, viagem, auditoria e eventos) foram
  removidos após a aprovação.
- A tentativa de executar o microservice SQL dentro do container Docker falhou
  por timeout de saída até o Azure SQL. O mesmo serviço conectado pelo host
  Windows passou e o smoke completo passou nesse arranjo. Portanto, a rede de
  saída entre containers e Azure SQL deve ser validada/ajustada para a topologia
  de hospedagem escolhida.
- A stack temporária e os volumes locais dela foram removidos. Nenhum recurso
  Azure foi criado nesta validação. O teste usa o runtime oficial local, não uma
  Function App publicada; URL pública e custo de Storage continuam pendentes.

## Implantação cloud — 12/11/2026

Ambiente Azure Container Apps `fuelwise-env` (Brazil South, Consumption, sem
Log Analytics), criado por `scripts/deploy-azure.sh` na assinatura Azure for
Students. Recursos novos: somente o ambiente e sete container apps; nenhum
Storage Account, ACR, Static Web App ou workspace de logs.

- Host oficial Azure Functions (`mcr.microsoft.com/azure-functions/node:4-node22`)
  validado localmente sem `AzureWebJobsStorage`: 401 sem chave, 400 para entrada
  inválida, 200 com o cálculo esperado. Na cloud: 401 sem chave e 200 com chave.
- Imagem `fuelwise-legacy-cloud` (API + PostgreSQL 16 efêmero) testada
  localmente com `/run` vazio e 1 MB de `/dev/shm`, simulando o sandbox do
  Container Apps: migrações, seed do admin e login passaram.
- `node scripts/smoke-delivery.mjs` com `SMOKE_GATEWAY_URL` e
  `SMOKE_LEGACY_URL` apontando para as URLs públicas: `result: PASS` (identidade,
  CRUD/preços de postos no Atlas, CRUD/finalização de viagens no Azure SQL,
  viagem ativa única 409, gateway+BFF+Function sem degradação, `TripCreated`
  consumido).
- A primeira execução falhou: 503 no trips (IP de saída novo bloqueado pela
  firewall do SQL) e depois `/aggregated-data` degradado (cold start acima do
  timeout de 5 s do BFF). Depois da regra /32 e com os apps aquecidos, passou.
- Prints reais das URLs públicas em `docs/evidence/cloud/` (Swagger BFF, Mongo,
  SQL, gateway, dashboard, postos, viagens), com dados fictícios.

Limitações observadas: o ambiente criado é do tipo express, que rejeita
sidecars e volumes de secret e não publica IPs de saída fixos. Os IPs
`20.206.106.252`, `20.226.18.13` e `20.206.93.129` foram observados e liberados (/32)
no SQL e no Atlas. Stations e trips registram `egress-ip=...` no start; um IP novo
exige nova regra. O BFF tem ingress interno, mas o FQDN responde pela internet.
