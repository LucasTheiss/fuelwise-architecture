# Execução e publicação da Entrega 3

## Local, preservando o ambiente original

O `compose.yaml` original continua executando todos os fluxos legados.
`compose.delivery.yaml` usa projeto/volumes próprios, sem remover dados antigos.
Não executar `down -v` em um ambiente com dados que se deseja preservar.

```powershell
Copy-Item .env.delivery.example .env.delivery
# Preencher senhas fortes e JWT_SECRET, sem versionar .env.delivery.
docker compose --env-file .env.delivery -f compose.delivery.yaml up -d --build
node scripts/smoke-delivery.mjs
```

Frontend: http://localhost:5173; gateway: http://localhost:18080;
Swagger BFF: http://localhost:18080/docs; legado: http://localhost:3000.
Swagger dos serviços é acessível na rede Docker em stations:3001/docs e
trips:3002/docs. Para inspeção local, encaminhar uma porta loopback explicitamente.
Os bancos não expõem portas no host. Health checks dos serviços verificam seus
bancos. O Compose padrão usa o adaptador Function Node; o overlay abaixo executa
o host oficial. A apresentação final continua exigindo Azure Functions público.

### Host oficial da Function, sem recursos Azure

```powershell
node scripts/prepare-function-runtime.mjs
docker compose --env-file .env.delivery --env-file .env.function-runtime -f compose.delivery.yaml -f compose.functions-runtime.yaml up -d --build
node scripts/test-function-runtime.mjs
node scripts/smoke-delivery.mjs
```

O overlay usa a imagem oficial `mcr.microsoft.com/azure-functions/node:4-node22`
e Azurite como armazenamento emulado local. A porta 7071 aceita somente loopback;
o BFF envia a chave em header. O teste verifica autenticação do host, resultados
e entradas inválidas. Os arquivos `.env.function-runtime` e `tmp/function-secrets/`
são ignorados. Gerar novas chaves exige recriar Function/BFF/Azurite com Compose.
Não publicar esse overlay: suas configurações são exclusivas de desenvolvimento.
Core Tools continua disponível como alternativa via `npm start` no projeto da
Function. Este teste local não comprova gratuidade nem implantação na Azure.

Para inspecionar os Swagger, adicionar `-f compose.inspect.yaml` ao comando
Compose: http://localhost:13001/docs e http://localhost:13002/docs. Apenas portas
loopback dos serviços são abertas; o frontend continua usando o gateway.
Ao parar a variante oficial, usar os mesmos `--env-file` e `-f` com `down`, sem `-v`.

Referência da imagem: [Microsoft - containers Functions](https://learn.microsoft.com/en-us/azure/azure-functions/container-concepts).

O teste smoke cria uma transportadora fictícia aprovada, gerente, motorista,
veículo, posto/preço e viagem. Verifica CRUD, conflito de viagem ativa, agregação
e consumo de evento. Não contém credenciais fixas. Pode ser executado novamente
com dados novos. Uma sessão de teste é salva em `tmp/`, ignorada pelo Git.

Parar sem apagar volumes:
`docker compose --env-file .env.delivery -f compose.delivery.yaml down`.

## Limite da migração

DOMAIN_MODE=distributed intercepta as rotas de postos/viagens do legado e as
encaminha aos novos donos. A inicialização recusa esse modo se houver postos ou
viagens no PostgreSQL: **não migra nem apaga dados automaticamente**.
O modo original continua íntegro. O financeiro antigo permanece disponível no
modo original; referências financeiras para viagens novas distribuídas ainda não
foram migradas. O fluxo de aceite desta entrega cobre postos, viagens, indicadores
e eventos. Não anunciar pagamento distribuído como concluído.

Antes de migrar uma instalação com dados reais: exportar com IDs preservados,
conciliar viagens em andamento/abastecimentos, desenhar a ponte financeira com
controle de concorrência, congelar os escritores antigos e testar recuperação.
O bloqueio atual evita duas fontes mutáveis de verdade por acidente.

## Cloud — Azure Container Apps (publicado em 12/11/2026)

URLs em `docs/PUBLIC_URLS.md`; custos e limites em `docs/CLOUD_COSTS.md`.

Pré-requisitos (Git Bash no Windows ou Bash no Linux/macOS): Azure CLI logado na
assinatura `Azure for Students`, Node, OpenSSL e curl. Se `az login` travar no
seletor de contas do Windows, usar `az config set core.enable_broker_on_windows=false`
e `az login --use-device-code`. Em redes onde IPv6 reseta conexões com a
Microsoft, preferir IPv4 (PowerShell como administrador):
`netsh interface ipv6 set prefixpolicy ::ffff:0:0/96 100 4`.

1. Copiar segredos para `.env.cloud` (ignorado pelo Git): `MONGODB_URI`,
   `MONGODB_DATABASE`, `AZURE_SQL_SERVER`, `AZURE_SQL_DATABASE`,
   `AZURE_SQL_USER`, `AZURE_SQL_PASSWORD`, `DOCKERHUB_USER`. O script gera e
   acrescenta `JWT_SECRET`, `LEGACY_DB_PASSWORD`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, `FUNCTION_KEY` e `FUNCTION_MASTER_KEY`.
2. Publicar imagens (o deploy usa o digest que o Docker Hub serve para a tag):
   `powershell -File scripts/docker-images.ps1 -DockerHubUser cristhiansk -Push`.
3. Implantar tudo: `bash scripts/deploy-azure.sh all`. Também aceita um app
   (`stations|legacy|trips|function|bff|gateway|frontend`), `firewall` ou `urls`.
4. Smoke público (dados fictícios):

```bash
D=redhill-64ef7229.brazilsouth.azurecontainerapps.io
ADMIN_EMAIL=... ADMIN_PASSWORD=... SMOKE_GATEWAY_URL=https://gateway.$D SMOKE_LEGACY_URL=https://legacy.$D node scripts/smoke-delivery.mjs
```

Topologia: `frontend` (nginx, `runtime-config.js` gerado no start a partir de
`GATEWAY_URL`) → `gateway` (`TLS_TERMINATED_UPSTREAM=true`,
`TRUST_PROXY_HOPS=1`) → `bff` (ingress interno) → `stations` (Atlas),
`trips` (Azure SQL, migração idempotente no start), `function` (host oficial,
chaves gravadas de secret em `/home/site/secrets`) e `legacy`
(`Dockerfile.cloud`: API + PostgreSQL efêmero em 127.0.0.1).

Operação:
- O ambiente é do tipo express: sem sidecars, sem volumes de secret e com IP de
  saída rotativo. Stations e trips imprimem `egress-ip=X` no start. Se o trips registrar `Client with IP address 'X' is not allowed`,
  ou o stations falhar com `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR`, liberar só `X/32`:
  `az sql server firewall-rule create -g Fuelwise -s fuelwise -n aca-egress-N --start-ip-address X --end-ip-address X`
  e `atlas accessLists create X/32 --projectId <id> --comment "Azure Container Apps egress"`.
- O PostgreSQL do legado é efêmero: após 30 min sem tráfego, o app escala a zero
  e contas/transportadoras são recriadas vazias (o admin é recriado no start).
  Rodar o smoke ou recriar os dados antes de gravar o vídeo.
- Logs sem Log Analytics: `az containerapp logs show -n <app> -g Fuelwise --tail 50 --format text`.
- Nunca abrir a firewall do SQL para 0.0.0.0–255.255.255.255 nem o Atlas para 0.0.0.0/0.

## Docker Hub e cinco repositórios

Somente após autorização, executar `docker login` interativamente; nunca fornecer
token na linha de comando ou arquivo versionado. `scripts/docker-images.ps1
-DockerHubUser USUARIO` faz builds; `-Push` publica explicitamente.

`scripts/export-projects.ps1` exporta apenas arquivos rastreados dos cinco
projetos, sem node_modules, segredos ou artefatos temporários. Para preservar
histórico, alternativa revisável: `git subtree split --prefix=projects/NOME -b
export-NOME` e push para repositório autorizado. Não executado automaticamente.
O gateway permanece na infraestrutura do repositório original.

## Validação

`npm ci` em cada diretório; `node scripts/validate-all.mjs`; `npm run check`;
`npm run build` no frontend; Compose e smoke. Integrações cloud são um gate
separado e não podem ser substituídas pelos testes isolados.
