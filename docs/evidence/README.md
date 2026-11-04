# Evidências

`local/` contém screenshots reais do ambiente Docker em 03/11/2026:
dashboard, postos, viagens e Swagger BFF. Dados são fictícios criados pelos
testes, mas a UI e as consultas/persistência são reais. Não são provas de cloud.

Em 04/11/2026 foram adicionadas capturas reais em Chromium headless:

| Arquivo local | Origem | Contexto |
|---|---|---|
| swagger-mongo.png | http://localhost:13001/docs/ | API de postos, Mongo local |
| swagger-sql.png | http://localhost:13002/docs/ | API de viagens, SQL Server local |
| gateway.png | http://localhost:18080/health/live | Resposta real do gateway |

Capturadas após o commit 116b527, com `compose.inspect.yaml` abrindo somente
loopback. Nenhum token inserido nos Swagger. A validação do host oficial da
Function está em `scripts/test-function-runtime.mjs` e `docs/VALIDATION.md`.

Para a entrega pública, capturar em `cloud/` (ainda não existente): Swagger BFF,
Swagger Mongo, Swagger SQL, frontend, gateway HTTPS, Function, agregado, dados
Atlas/Azure e evento consumido. Remover tokens, connection strings e dados
pessoais das capturas. Registrar URL real, horário, commit e cenário executado.
Não reutilizar screenshots locais como se fossem evidência de implantação pública.
