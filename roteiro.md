# Roteiro do vídeo — FuelWise, Entrega 3 (≈ 10 min)

Vídeo no YouTube como **não listado**. **Os quatro integrantes falam**, e cada um
diz o próprio nome ao começar. Só aparecem URLs da cloud (`*.azurecontainerapps.io`,
MongoDB Atlas, portal Azure), **nunca `localhost`**. Não mostrar senhas, tokens
nem a chave da Function.

Validado em 12/11/2026: todos os passos abaixo foram executados no navegador
contra as URLs públicas, com 11/11 verificações aprovadas (ver "Validação").

## URLs (copie inteiras: o domínio termina em `brazilsouth.azurecontainerapps.io`)

| Componente | URL |
|---|---|
| Frontend | https://frontend.redhill-64ef7229.brazilsouth.azurecontainerapps.io |
| Swagger BFF (via API Gateway) | https://gateway.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs |
| Swagger Microservice Mongo | https://stations.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs |
| Swagger Microservice SQL | https://trips.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs |
| Azure Function | https://function.redhill-64ef7229.brazilsouth.azurecontainerapps.io/api/indicators |

## Antes de gravar (passo a passo, ~15 min)

1. **Criar os dados de demo.** O banco do legado zera após 30 min sem uso, então
   faça isso logo antes de gravar. Na raiz do repositório (Git Bash), com o
   `.env.cloud` preenchido:

   ```bash
   D=redhill-64ef7229.brazilsouth.azurecontainerapps.io
   ADMIN_EMAIL=$(grep ^ADMIN_EMAIL= .env.cloud | cut -d= -f2-) \
   ADMIN_PASSWORD=$(grep ^ADMIN_PASSWORD= .env.cloud | cut -d= -f2-) \
   GATEWAY_URL=https://gateway.$D LEGACY_URL=https://legacy.$D \
   node scripts/seed-demo.mjs
   ```

   Ele imprime o **e-mail e a senha do gerente demo**. O admin é `ADMIN_EMAIL` /
   `ADMIN_PASSWORD` do `.env.cloud`. Cria transportadora aprovada, 2 motoristas,
   2 veículos e 2 postos com preço.
2. **Aquecer.** Abrir o frontend, logar como gerente e esperar o painel carregar.
   Abrir os três Swagger. A primeira chamada pode levar até 1 min (apps acordando
   e Azure SQL saindo do AutoPause). Se der erro, espere 1 min e recarregue.
3. **Se Postos ou Viagens derem 503 depois de aquecidos:** o IP de saída da Azure
   mudou. Ver "IP de saída" em `docs/DEPLOYMENT.md` (uma regra /32 no SQL e no Atlas).
4. **Deixar abas abertas:** frontend, os três Swagger, Atlas > Data Explorer
   (`fuelwise_stations`), portal Azure > `fuelwiseDB` > Query editor (login
   `fuelwise-adm`; aceitar liberar o IP de quem apresenta), portal > Container
   Apps `bff`, `function` e `trips` > Log stream, GitHub e Docker Hub
   (`docs/PUBLIC_URLS.md`).
5. **Tokens para o Swagger BFF:** fazer `POST /api/v1/auth/login` no próprio Swagger
   com o login do admin e do gerente, copiar `accessToken` e usar em **Authorize**.
   Não deixar o token visível na gravação.

## Roteiro

### 0:00–2:00 · Artur Ribeiro de Souza — visão geral e frontend

- "Eu sou o Artur." Objetivo do FuelWise: gestão de frota e combustível.
- Mostrar no ARC42 os diagramas C4 de contêineres e de implantação cloud:
  microfrontend → API Gateway → BFF → microservice Mongo, microservice SQL e
  Azure Function; eventos por outbox.
- Abrir o **frontend** pela URL na barra de endereço. DevTools > Network: os
  microfrontends `/modules/stations/remote.js` e `/modules/trips/remote.js`
  carregando, e todas as chamadas indo para `gateway…`, nunca direto aos serviços.

**Cobre:** frontend funcionando, URL cloud, microfrontend, fluxo da arquitetura.

### 2:00–4:30 · Cristhian Rezende — Postos (MongoDB Atlas)

- "Eu sou o Cristhian." Login como **admin**, aba **Postos**.
- **Novo posto** → preencher → Salvar: aparece na lista.
- **Editar** o nome → Salvar.
- **Preço:** no Swagger BFF, `POST /api/v1/stations/{id}/prices` com
  `{"fuelType":"DIESEL_S10","pricePerLiter":6.149}` → 201; `GET` do mesmo caminho
  mostra o histórico.
- **Desativar** o posto na tela: some da lista (exclusão lógica).
- Mostrar os documentos no **Atlas Data Explorer** e o **Swagger do microservice Mongo**.

**Cobre:** CRUD completo, MongoDB Atlas, Swagger do microservice 1.

### 4:30–7:00 · Lucas Andriani Theiss — Viagens (Azure SQL) e regra de negócio

- "Eu sou o Lucas." Sair, login como **gerente**, aba **Viagens**.
- **Nova viagem**: motorista + veículo + observação → Salvar ("Em andamento").
- **Editar** a observação → Salvar.
- **Regra de negócio:** Nova viagem com o **mesmo motorista** → mensagem
  "Motorista ou veículo já possui viagem em andamento" (409, garantida por
  índice único no Azure SQL).
- **Finalizar** a viagem → "Finalizada"; **Desativar** → sai da lista.
- Criar outra viagem com o **outro** motorista e veículo e deixá-la em andamento
  (alimenta o painel do Vinicius).
- Query editor: `SELECT TOP 5 id,status,notes,is_active FROM dbo.trip ORDER BY started_at DESC`.
- Mostrar o **Swagger do microservice SQL**.

**Cobre:** CRUD completo, regra de negócio, Azure SQL (SQL Server), Swagger do microservice 2.

### 7:00–9:30 · Vinicius da Rosa Padilha — BFF, Function e eventos

- "Eu sou o Vinicius." Aba **Visão geral**: os números vêm de `GET /aggregated-data`.
- No **Swagger BFF** (Authorize com token do gerente), executar `/aggregated-data`:
  um único JSON com `stations` (Mongo), `trips` (SQL) e `analytics` (Function),
  `degraded: false`.
- Log stream do `bff` (`/aggregated-data` 200) e do `function`
  (`Executed 'Functions.indicators' (Succeeded…)`).
- **Eventos:** no Swagger BFF, `GET /api/v1/events`: TripCreated, TripUpdated,
  TripFinished e TripDeactivated da viagem do Lucas. Query editor:
  `SELECT TOP 5 type,delivered_at,attempts FROM dbo.outbox ORDER BY occurred_at DESC` e
  `SELECT TOP 5 type,trip_id,processed_at FROM dbo.trip_audit ORDER BY processed_at DESC`.
  Log stream do `trips`: `event_consumed`.
- Explicar: outbox transacional, entrega pelo menos uma vez, deduplicação por `event_id`.

**Cobre:** chamadas passando pelo BFF, agregação, Azure Function, eventos, fluxo completo.

### 9:30–10:00 · Todos — fechamento (uma frase cada)

Clean Architecture (`domain/application/infrastructure/api`), Vertical Slice
(`features/create`, `features/list`…), testes unitários e de arquitetura, imagens
no Docker Hub, cinco repositórios no GitHub e ARC42/PDF.

## Checklist do enunciado

- [ ] Todos falaram e disseram o nome.
- [ ] Só URLs cloud apareceram (nenhum `localhost`).
- [ ] Frontend funcionando.
- [ ] Chamadas passando pelo BFF (Network, Swagger BFF, Log stream).
- [ ] CRUD completo de postos e de viagens; regra de negócio (conflito 409).
- [ ] Integração com MongoDB, SQL Server (Azure SQL) e Azure Function.
- [ ] Eventos: `/api/v1/events`, `outbox.delivered_at`, `trip_audit`, `event_consumed`.
- [ ] Fluxo completo: frontend → gateway → BFF → serviços/Function → bancos.

Depois: publicar como não listado e colar o link em `docs/PUBLIC_URLS.md` e no ARC42/PDF.
Não dizer que pagamentos simulados movimentam dinheiro, nem que o financeiro foi distribuído.

## Validação (12/11/2026)

Script Playwright executou o roteiro nas URLs públicas: frontend e microfrontends
carregados, chamadas só ao gateway; posto criado, editado, com preço e desativado;
viagem criada, editada, conflito 409 com mensagem amigável, finalizada e
desativada; Swagger BFF/Mongo/SQL abrindo; `/aggregated-data` com
`degraded:false` e `activeTrips:1`; eventos dos 4 tipos consumidos. Logs:
`Functions.indicators` Succeeded, `event_consumed` e `/aggregated-data` 200.
**Não testados por automação:** telas do Atlas Data Explorer, Query editor e Log
stream do portal (o mesmo conteúdo foi conferido por CLI).
