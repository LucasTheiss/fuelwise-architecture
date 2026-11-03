# Roteiro — vídeo não listado, quatro integrantes

Usar URLs **públicas HTTPS**, jamais apresentar localhost como entrega cloud.
Pré-condições: preencher PUBLIC_URLS.md, confirmar custos, smoke cloud aprovado,
contas ADMIN/MANAGER/DRIVER e frota de demonstração. Não mostrar senhas/tokens.

| Tempo | Integrante | Demonstração e fala |
|---|---|---|
| 0–2 min | Artur Ribeiro de Souza | Identificar-se; apresentar objetivo FuelWise e C4; abrir frontend público; mostrar shell e dois remotos no Network; explicar gateway/BFF |
| 2–4 min | Cristhian Rezende | Identificar-se; login ADMIN; cadastrar, consultar, editar e desativar posto; mostrar persistência no Atlas e Swagger Mongo; cadastrar outro posto para dashboard |
| 4–6 min | Lucas Andriani Theiss | Identificar-se; login MANAGER; criar viagem com frota válida, consultar/editar/finalizar/desativar; mostrar SQL Azure, índices e conflito de segunda viagem ativa; Swagger SQL |
| 6–8 min | Vinicius da Rosa Padilha | Identificar-se; chamar /aggregated-data pelo gateway; mostrar logs BFF/serviços/Function e resultado no dashboard; criar evento e mostrar outbox/auditoria; explicar idempotência, testes e limitações |

Mostrar Swagger BFF, gateway HTTPS, endpoint real da Function com chave oculta,
e rastreio por horário/ID da viagem. Um registro no outbox não basta: mostrar
`delivered_at`, auditoria e log `event_consumed`. Reentrega deve manter um efeito.
Finalizar com GitHub, Docker Hub e documentação. Não dizer que integrações de
pagamento simuladas movimentam dinheiro, nem que o financeiro foi distribuído.
Não publicar vídeo automaticamente. Copiar URL não listada para PUBLIC_URLS.md.
