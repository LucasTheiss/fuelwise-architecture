# Validação executada — 03/11/2026

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

Atlas Free e Azure SQL gratuitos reais; runtime Azure Functions/Core Tools;
HTTPS público; testes de custo/quotas; publicação dos cinco GitHub e três imagens;
screenshots cloud; vídeo não listado com os quatro integrantes. CI foi preparado,
mas não foi executado no GitHub porque não houve push.

Financeiro/GPS/denúncias de entidades novas não foram migrados: execução original
é preservada. Corte sobre banco legado preenchido é deliberadamente bloqueado.
Testes de carga, SLA, recuperação de desastre e auditoria de segurança pendentes.
