# Entrega 3 — plano incremental

## Diagnóstico (03/11/2026)

Leitura integral dos dois Markdown e das 53 páginas do PDF fornecido. O código,
os scripts, a migration, os oito arquivos de testes e o CI foram inspecionados.
O PDF distingue implementação atual de proposta futura: quatro serviços,
Service Bus e API Management são propostas, não obrigações desta entrega.
Prevalecem dois serviços (Postos/MongoDB e Viagens/Azure SQL), um BFF e uma
Function HTTP, com gateway gratuito operável localmente.

Baseline: Node 22.22.0 portátil; `npm test`: 37/38 aprovados. A única falha é a
convenção de nomes aplicada ao PDF de entrada, cujo nome contém `%`.
`npm run check`: 101 arquivos JavaScript, zero erros. Docker instalado, engine
indisponível. Nenhuma integração cloud foi executada ou provisionada.

## Inventário e reaproveitamento

| Domínio | Existente | Trabalho necessário |
|---|---|---|
| auth | login, refresh rotativo, logout, me, cadastro transportadora/gerente | consumir identidade existente por HTTP |
| carriers | aprovação/recusa ADMIN, listagem pendente, CNPJ | preservar |
| drivers | criação/listagem por transportadora | preservar como cadastro mestre |
| vehicles | criação/listagem, GPS e cache | preservar como cadastro mestre |
| trips | iniciar/listar/finalizar; exclusividade de motorista/veículo; bloqueio financeiro | SQL Server, get/update/desativação, portas, outbox |
| stations | criar/listar/detalhar, raio geográfico, filiados e histórico de preços | Mongo, update/desativação, portas |
| fuelings | registro com preço vigente, decisão do gerente | preservar regras e transações |
| payments | reserva, idempotência, cobrança e conciliação UNKNOWN | preservar integralmente |
| analytics | consumo mensal e auditoria financeira | preservar |
| complaints | alvo exclusivo, isolamento, moderação | preservar |
| notifications | outbox persistente, retry, worker, caixa e token FCM | aproveitar padrão para eventos |

Arquitetura atual: monólito modular Express/ESM, 34 slices em 11 domínios,
PostgreSQL 16, Zod, JWT, bcrypt, decimal.js, DI no núcleo financeiro. HTTP em
`docs/API.md`; ainda sem OpenAPI. Docker/Compose e CI existentes, sem lockfile.
Integrações externas configuráveis, mocks explícitos em homologação. Testes
atuais são unitários/estáticos, não provam funcionamento com banco real.

Reaproveitar `src/domain/*`, regras e contratos de `src/slices/stations/*` e
`src/slices/trips/*`, autenticação `src/shared/auth/*`, validações, erros e padrão
outbox. Manter todos os demais slices e migration original. Novos projetos em
`projects/`, cada um com package, testes, README, configuração e build próprios.

## Arquitetura e migração

React shell carrega módulos Postos/Viagens em runtime. Gateway encaminha ao BFF;
BFF consulta Postos, Viagens e Function, sem driver de banco. Serviços verificam
identidade pelo legado, sem confiar em headers de perfil enviados pelo cliente.
Postos usa somente MongoDB; Viagens somente Azure SQL. A API legada continua
responsável por identidade, frota e financeiro. Nenhum banco é acessado por outro
serviço. Eventos são gravados atomicamente e consumidos de forma idempotente.

Extração incremental: preservar execução original; modo distribuído deve ter
proprietário único para postos/viagens. Não realizar migração destrutiva automática.
A ativação sobre dados existentes exige exportação, conferência de IDs e corte
controlado. Documentar explicitamente limitações das relações financeiras e não
apresentar bancos locais ou mocks como integração Atlas/Azure homologada.

## Fases e commits

- [x] A: diagnóstico, baseline e plano (este documento).
- [ ] B: serviço Mongo, CRUD/preços, Swagger, testes e Docker.
- [ ] C: serviço SQL, CRUD/transições, migration, testes e Docker.
- [ ] D: BFF, proxies, agregação e testes.
- [ ] E: Function HTTP, indicadores, validação e testes.
- [ ] F: gateway, CORS, TLS e limites.
- [ ] G: shell React e dois módulos carregados em runtime.
- [ ] H: publicação/consumo assíncrono, retry, duplicidade e AsyncAPI.
- [ ] I: Compose, builds, CI, testes integrados e preparação Docker Hub.
- [ ] J: ARC42, C4, Canvas, custos, READMEs, evidências e roteiro.

Cada fase terá validação e commit próprio. Publicação GitHub/Docker Hub e
provisionamento dependem de credenciais, autorização e confirmação da gratuidade.

## Riscos e dependências

- Azure for Students pode não ser elegível à oferta SQL gratuita; verificar fontes
  oficiais e assinatura antes de criar recursos. Não usar créditos sem autorização.
- Functions precisa de storage; franquia de execução não garante custo total zero.
- Preservar RBAC, tenant, precisão monetária e exclusividade sob concorrência.
- Referências PostgreSQL entre viagens, postos e financeiro exigem migração
  coordenada; não tratar duas cópias mutáveis como fonte de verdade.
- Validações locais não substituem CRUD real no Atlas/Azure, deploy público e vídeo.
- Não inventar URLs ou screenshots. Registrar pendências de maneira verificável.

### Fase B — resultado

Serviço Postos implementado com CRUD/desativação, consulta geográfica, filiados,
histórico de preços, identidade HTTP, Swagger, Docker e lockfile independente.
Teste HTTP de CRUD/RBAC/validação passou; teste Mongo real disponível e ignorado
por ausência de TEST_MONGODB_URI. Regressão legado: 38/38 após excluir somente
os documentos de entrada da convenção de nomes. Atlas ainda não homologado.

### Fase C — resultado

Viagens implementado com porta SQL, consultas parametrizadas, índices exclusivos,
transações, outbox atômico, CRUD/desativação e finalização. Duas consultas HTTP
adicionadas ao legado para validar frota/pendências sem acesso cruzado a bancos.
Testes: dois cenários (domínio e fluxo HTTP) aprovados, legado 38/38. SQL real
não executado; credenciais e engine ainda indisponíveis. A ponte financeira
com registros novos continua sendo uma restrição de migração a documentar.

### Fase D — resultado

BFF implementado: proxies com destinos fixos, autenticação no legado, timeout,
agregação dos dois serviços e chamada HTTP da Function, HTTP 207 em falha parcial.
Quatro testes passaram. Os indicadores declaram explicitamente amostra de até
100 registros por serviço. Function real e integração de processos serão
verificadas nas fases E/I; publicação ainda pendente.

### Fase E — resultado

Function HTTP v4 implementada e OpenAPI disponível. Três testes passaram;
handler aceita dados reais do BFF e preserva null em falhas parciais. Adaptador
HTTP local explícito para desenvolvimento. Runtime Azure/Core Tools e deploy
não executados neste ambiente; nenhuma cobrança ou recurso criado.

### Fase F — resultado

Gateway independente implementado com destino fixo, allowlist de rotas, CORS,
limites por IP e suporte HTTPS por certificado/terminador confiável. Teste de
roteamento, origem rejeitada e excesso de requisições passou. TLS público ainda
não validado; produção recusa iniciar sem configuração explícita de HTTPS.

### Fase G — resultado

Shell React e dois remotos ES modules com contratos mount/unmount, cada um com
build independente e carregamento em runtime. CRUD, dashboard, login, estados de
espera/erro e feedback implementados. Três builds de produção e teste de fronteiras
passaram. Verificação visual/E2E ainda necessária. Tokens somente em memória.
