# Roteiro do vídeo — Entrega 3 (≈ 10 min)

YouTube **não listado**. **Todos os quatro integrantes falam**, e cada um diz o
próprio nome ao começar a sua parte. Só URLs públicas HTTPS (`*.azurecontainerapps.io`);
nunca abrir `localhost`. Não mostrar senhas, tokens nem `x-functions-key`.

Domínio: `D = redhill-64ef7229.brazilsouth.azurecontainerapps.io`

## Preparação (até 15 min antes, fora da gravação)

1. Rodar `node scripts/seed-demo.mjs` (comando completo em `docs/DEPLOYMENT.md`).
   Ele imprime o login do gerente demo. Guardar com o login do admin (`.env.cloud`).
2. Aquecer: abrir o frontend, logar e esperar o painel carregar; abrir os três
   Swagger. Se Postos ou Viagens derem 503 depois de aquecidos, ver "IP de saída"
   em `docs/DEPLOYMENT.md`.
3. Deixar abas abertas: frontend · `https://gateway.D/docs` · `https://stations.D/docs` ·
   `https://trips.D/docs` · Atlas > Data Explorer (`fuelwise_stations`) · Portal Azure >
   `fuelwiseDB` > Query editor (liberar o IP de quem apresenta) · Portal > Container
   App `bff` e `trips` > Log stream · GitHub e Docker Hub (`docs/PUBLIC_URLS.md`).
4. A partir do seed, gravar em até 30 min: o banco do legado zera depois disso.

## Roteiro

| Tempo | Quem fala | O que mostrar e dizer | Requisito coberto |
|---|---|---|---|
| 0:00–2:00 | **Artur Ribeiro de Souza** | "Eu sou o Artur." Objetivo do FuelWise. Diagrama C4 de contêineres e de implantação (ARC42 seção 7): microfrontend → API Gateway → BFF → microservice Mongo, microservice SQL, Azure Function; eventos por outbox. Abrir `https://frontend.D` na barra de endereço e mostrar no DevTools > Network: carga dos remotos `/modules/stations` e `/modules/trips` e chamadas indo para `gateway.D`, nunca direto aos serviços. | Frontend funcionando, URL cloud, fluxo da arquitetura, microfrontend |
| 2:00–4:30 | **Cristhian Rezende** | "Eu sou o Cristhian." Login como **admin**. Aba Postos: **criar** posto, **listar**, **editar** nome. Registrar **preço** pelo Swagger BFF (`POST /api/v1/stations/{id}/prices`, Authorize com token do admin). **Desativar** um posto na tela. Mostrar os documentos no Atlas Data Explorer. Abrir Swagger do microservice Mongo (`stations.D/docs`). | CRUD completo, MongoDB Atlas, Swagger microservice 1 |
| 4:30–7:00 | **Lucas Andriani Theiss** | "Eu sou o Lucas." Login como **gerente**. Aba Viagens: **criar** viagem (motorista + veículo), **consultar**, **editar** observações. Tentar segunda viagem com o mesmo motorista: **erro de conflito** (regra: uma viagem ativa por motorista/veículo, garantida por índice no SQL). **Finalizar** e **desativar**. No Query editor: `SELECT TOP 5 id,status,notes,is_active FROM dbo.trip ORDER BY started_at DESC`. Abrir Swagger do microservice SQL (`trips.D/docs`). | CRUD + regra de negócio, Azure SQL, Swagger microservice 2 |
| 7:00–9:30 | **Vinicius da Rosa Padilha** | "Eu sou o Vinicius." Painel Visão geral: indicadores vêm de `GET /aggregated-data`, que consulta Mongo + SQL + Function e devolve um único JSON. Swagger BFF (`gateway.D/docs`): Authorize com o token do gerente (sem mostrar o valor), executar `/aggregated-data` e mostrar `stations`, `trips`, `analytics` e `degraded: false`. Function: mostrar o app `function` no portal e o Log stream do `bff` com a chamada. **Eventos**: executar `GET /api/v1/events` (TripCreated/TripUpdated/TripFinished/TripDeactivated da viagem do Lucas); no Query editor: `SELECT TOP 5 type,delivered_at,attempts FROM dbo.outbox ORDER BY occurred_at DESC` e `SELECT TOP 5 type,trip_id,processed_at FROM dbo.trip_audit ORDER BY processed_at DESC`; Log stream do `trips` com `event_consumed`. Explicar: outbox transacional, entrega pelo menos uma vez, deduplicação por `event_id`. | Chamadas pelo BFF, agregação, Azure Function, eventos, fluxo completo |
| 9:30–10:00 | **Todos** (cada um uma frase) | Clean Architecture + Vertical Slice (pastas `domain/application/infrastructure/api` e `features/create...`), testes unitários e de arquitetura, Docker Hub, cinco repositórios GitHub e ARC42/PDF. | Fechamento, artefatos |

## Checklist do enunciado

- [ ] Todos falaram e se identificaram pelo nome.
- [ ] Só URLs cloud (`*.azurecontainerapps.io`, Atlas, portal Azure) aparecem.
- [ ] Frontend funcionando.
- [ ] Chamadas passando pelo BFF (Network + Swagger BFF + Log stream).
- [ ] CRUD completo (postos e viagens) e regra de negócio (conflito de viagem ativa).
- [ ] MongoDB Atlas, Azure SQL (SQL Server) e Azure Function mostrados.
- [ ] Eventos: outbox `delivered_at`, `trip_audit` e log `event_consumed`.
- [ ] Fluxo completo frontend → gateway → BFF → serviços/Function → bancos.

Não dizer que pagamentos simulados movimentam dinheiro, nem que o financeiro foi
distribuído. Publicar como não listado e copiar o link para `docs/PUBLIC_URLS.md`
e para o ARC42/PDF.
