# Roteiro 1 — Gravação de tela (sem áudio)

**Para quê:** a tela é gravada primeiro, por uma pessoa, e as falas são dubladas
depois (`roteiro-falas.md`). As seções **S1–S5** e os tempos são os mesmos nos dois
roteiros. Cada ação fica parada na tela de 2 a 3 s, para caber a narração.

**Regras da gravação (exigências do enunciado):**
- Só URLs da cloud na barra de endereço (`*.azurecontainerapps.io`, Atlas, portal
  Azure). Nunca `localhost`. Deixar a barra de endereço visível.
- Não mostrar senha, token (`accessToken`) nem chave da Function. No Swagger,
  colar o token em **Authorize** fora da gravação ou com o campo fora de quadro.
- Navegador em 1440×900 ou maior, zoom 110–125%.

## Preparação (fora da gravação) — Git Bash na raiz do repositório

1. `bash scripts/deploy-azure.sh hold`: fixa 1 réplica por app (sem troca de IP,
   sem cold start, dados não zeram) e libera os IPs no SQL e no Atlas.
2. Criar dados de demo e anotar o login do gerente:

   ```bash
   D=redhill-64ef7229.brazilsouth.azurecontainerapps.io
   ADMIN_EMAIL=$(grep ^ADMIN_EMAIL= .env.cloud | cut -d= -f2-) \
   ADMIN_PASSWORD=$(grep ^ADMIN_PASSWORD= .env.cloud | cut -d= -f2-) \
   GATEWAY_URL=https://gateway.$D LEGACY_URL=https://legacy.$D node scripts/seed-demo.mjs
   ```
3. Abrir as abas, nesta ordem:
   1. `docs/ARC42_DELIVERY3.md` no GitHub (seções 5 e 7, com os diagramas)
   2. https://frontend.redhill-64ef7229.brazilsouth.azurecontainerapps.io
   3. https://gateway.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs (Swagger BFF)
   4. https://stations.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs
   5. https://trips.redhill-64ef7229.brazilsouth.azurecontainerapps.io/docs
   6. Atlas > Data Explorer > `fuelwise_stations` > `stations`
   7. Portal Azure > `fuelwiseDB` > Query editor (login `fuelwise-adm`; liberar o IP se pedir)
   8. Portal Azure > Container Apps `bff`, `function` e `trips` > Log stream
   9. GitHub (5 repositórios) e Docker Hub (`docs/PUBLIC_URLS.md`)
4. No Swagger BFF, fazer login (`POST /api/v1/auth/login`) com admin e com
   gerente e guardar os dois tokens fora da tela.
5. Ensaiar uma vez. Depois do ensaio, refazer o passo 2 (dados limpos).

**Depois de gravar:** `bash scripts/deploy-azure.sh release` (volta ao scale-to-zero
e para de consumir o grant gratuito).

---

## S1 · 0:00–1:45 · Arquitetura e frontend (narração: Artur)

| # | Ação na tela | Deve aparecer |
|---|---|---|
| 1.1 | Aba ARC42: rolar até "5. Blocos de construção (C4 Contêineres)" | Diagrama C4 de contêineres |
| 1.2 | Rolar até "7. Implantação" | Diagrama da Azure (Container Apps, Atlas, Azure SQL) |
| 1.3 | Aba frontend; abrir DevTools > Network (filtro "Fetch/XHR" + "JS") | URL `frontend…azurecontainerapps.io` |
| 1.4 | Login com o **gerente** | Painel "Visão geral" com os números |
| 1.5 | Clicar Postos e Viagens | Network: `/modules/stations/remote.js`, `/modules/trips/remote.js` e chamadas para `gateway…` |
| 1.6 | Fechar DevTools; clicar **Sair** | Tela de login |

## S2 · 1:45–4:00 · CRUD de Postos + MongoDB Atlas (narração: Cristhian)

| # | Ação na tela | Deve aparecer |
|---|---|---|
| 2.1 | Login com o **admin**; aba Postos | Lista de postos |
| 2.2 | **Novo posto**: Nome "Posto Vídeo", endereço, lat −25.45, long −49.24, filiado → Salvar | Posto na lista + "Posto salvo com sucesso." |
| 2.3 | **Editar** → nome "Posto Vídeo Editado" → Salvar | Nome alterado |
| 2.4 | Aba Swagger BFF (já autorizado como admin): `GET /api/v1/stations` → copiar o `id` do posto; `POST /api/v1/stations/{id}/prices` com `{"fuelType":"DIESEL_S10","pricePerLiter":6.149}` → Execute | Resposta **201** |
| 2.5 | `GET /api/v1/stations/{id}/prices` → Execute | Histórico com 6.149 |
| 2.6 | Aba Atlas Data Explorer → atualizar | Documento "Posto Vídeo Editado" |
| 2.7 | Voltar ao frontend → **Desativar** o posto → confirmar | Some da lista |
| 2.8 | Aba Swagger Mongo (`stations…/docs`) → rolar | Lista de endpoints CRUD |
| 2.9 | Frontend → **Sair** | Tela de login |

## S3 · 4:00–6:30 · CRUD de Viagens + regra de negócio + Azure SQL (narração: Lucas)

| # | Ação na tela | Deve aparecer |
|---|---|---|
| 3.1 | Login com o **gerente**; aba Viagens | Lista de viagens |
| 3.2 | **Nova viagem**: motorista "João Motorista", 1º veículo, obs. "Curitiba – Paranaguá" → Salvar | Linha "Em andamento" |
| 3.3 | **Editar** → obs. "Curitiba – Paranaguá via BR-277" → Salvar | Observação alterada |
| 3.4 | **Nova viagem** de novo com **João Motorista** → Salvar | Erro "Motorista ou veículo já possui viagem em andamento" |
| 3.5 | Cancelar → **Finalizar** a viagem → confirmar | Situação "Finalizada" |
| 3.6 | **Desativar** → confirmar | Sai da lista |
| 3.7 | **Nova viagem** com "Maria Motorista" e o 2º veículo, obs. "Curitiba – Londrina" → Salvar | Viagem em andamento (fica para S4) |
| 3.8 | Aba Query editor: `SELECT TOP 5 id,status,notes,is_active FROM dbo.trip ORDER BY started_at DESC` → Run | Linhas IN_PROGRESS e FINISHED (is_active 0) |
| 3.9 | Aba Swagger SQL (`trips…/docs`) → rolar | Endpoints de viagens, incluindo `/finish` |

## S4 · 6:30–9:00 · BFF, Azure Function e eventos (narração: Vinicius)

| # | Ação na tela | Deve aparecer |
|---|---|---|
| 4.1 | Frontend → aba **Visão geral** | Postos, Viagens 1, Em andamento 1 |
| 4.2 | Swagger BFF → Authorize com token do **gerente** (fora de quadro) → `GET /aggregated-data` → Execute | JSON com `stations`, `trips`, `analytics` e `"degraded": false` |
| 4.3 | Log stream `bff` | Linha `"path":"/aggregated-data","status":200` |
| 4.4 | Log stream `function` | `Executed 'Functions.indicators' (Succeeded…)` |
| 4.5 | Swagger BFF → `GET /api/v1/events` → Execute | Eventos TripCreated, TripUpdated, TripFinished, TripDeactivated |
| 4.6 | Query editor: `SELECT TOP 5 type,delivered_at,attempts FROM dbo.outbox ORDER BY occurred_at DESC` | `delivered_at` preenchido |
| 4.7 | Query editor: `SELECT TOP 5 type,trip_id,processed_at FROM dbo.trip_audit ORDER BY processed_at DESC` | Auditoria dos eventos |
| 4.8 | Log stream `trips` | `"event":"event_consumed"` |

## S5 · 9:00–10:00 · Fechamento (narração: todos)

| # | Ação na tela | Deve aparecer |
|---|---|---|
| 5.1 | GitHub de um microservice: pastas `src/domain`, `src/application`, `src/infrastructure`, `src/api`, `src/features/create…` | Clean Architecture + Vertical Slice |
| 5.2 | `tests/` do microservice (unitários) e, no repositório principal, `tests/distributed-architecture.test.js` e `tests/architecture-rules.test.js` | Testes unitários e de arquitetura |
| 5.3 | Os 5 repositórios GitHub, um após o outro | READMEs com URLs cloud |
| 5.4 | Docker Hub `cristhiansk` | Imagens `fuelwise-*` com tag v1 |
| 5.5 | ARC42/PDF (`output/pdf/FuelWise_Delivery3.pdf`) | Capa com nomes dos alunos |

**Edição:** colocar legenda com o nome de quem fala no início de S1–S4 (reforça
"todos falam, explícito"). Publicar no YouTube como **não listado**.
