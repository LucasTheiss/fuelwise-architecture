# Decisões e limites de arquitetura

## ADRs

- **ADR-01:** Node.js 22 ESM + Express/Zod/pg, substituindo Java/Spring Boot conforme solicitação.
- **ADR-02:** Vertical Slice por caso de uso (`route.js`, `useCase.js` e `repository.js` quando apropriado); infraestrutura compartilhada em `src/shared`.
- **ADR-03:** PostgreSQL 16 com constraints ACID e SQL explícito; tabelas/colunas `snake_case` em inglês.
- **ADR-04:** Dependências externas isoladas em adaptadores injetados em `src/app.js` (DIP/ISP).
- **ADR-05:** A aprovação do gerente precede a cobrança. Gateway é sempre idempotente por chave e com uma única linha de `payment` por `fueling`.
- **ADR-06:** `INTEGRATION_MODE=mock` simula GPS, postos externos e push; default para pagamento também é `mock`. Em produção, mocks são proibidos.
- **ADR-07:** Notification outbox marca `SIMULATED` em homologação para evitar falsa confirmação de entrega FCM.
- **ADR-08:** Integrações reais ainda precisam de endpoints e credenciais de fornecedores não definidos na documentação.

## SOLID aplicado

- **SRP:** transporte HTTP e caso de uso separados; gateway/SQL em componentes próprios.
- **OCP/LSP:** adapters reais e mocks implementam as mesmas assinaturas (`charge/check`, `locate`, `list`, `send`).
- **ISP:** cada serviço expõe apenas métodos necessários.
- **DIP:** payment use case recebe `paymentStore` e `gateway` injetados pelo composition root.

## Integração real (contratos de referência)

Para testar integração real: `INTEGRATION_MODE=live`, `PAYMENT_PROVIDER=http`, `PAYMENT_API_URL`, `PAYMENT_API_KEY`, `PAYMENT_SUPPORTS_IDEMPOTENCY=true`, `GPS_API_URL`, `GPS_API_KEY`, `STATIONS_API_URL`, `STATIONS_API_KEY`, `FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, `FCM_PRIVATE_KEY`.

- `GET {GPS_API_URL}/vehicles/{vehicleId}/location` retorna `latitude`, `longitude`, `recordedAt`.
- `GET {STATIONS_API_URL}/stations` retorna `{ "stations": [...] }`.
- `POST {PAYMENT_API_URL}/charges` recebe `reference`, `amount`, `currency` e idempotency key; responde `status` (`APPROVED`/`REJECTED`), `transactionId`, `message`.
- `GET {PAYMENT_API_URL}/charges/{paymentId}` retorna estado para conciliação (`APPROVED`/`REJECTED`/`UNKNOWN`).
- FCM usa Firebase HTTP v1 e credenciais service account.

**Atenção:** esses contratos HTTP são abstrações da implementação, não APIs já contratadas. Um gateway de produção exige integração formal, webhooks verificados, contabilidade, homologação e procedimentos de conciliação. O projeto não realiza PIX real.

## Lacunas conhecidas

### Evolução Entrega 3

- Dois serviços extraídos, Postos/Mongo e Viagens/Azure SQL, prevalecem sobre os
  quatro serviços futuros do PDF. A autenticação/frota permanecem no legado.
- Modo distribuído isolado recusa banco legado com postos/viagens existentes;
  não há migração destrutiva nem duas fontes mutáveis silenciosas.
- Histórico financeiro continua no modo original. Ponte para entidades novas
  e migração de instalações existentes não estão concluídas.
- Outbox SQL + worker/auditoria idempotente evita dependência de broker pago.
- Remotos React usam ES modules em runtime, contrato mount/unmount versionado.
- TLS/custos/publicação cloud são gates separados dos testes Docker locais.
- Estado atualizado: `ARC42_DELIVERY3.md`, `VALIDATION.md` e `CLOUD_COSTS.md`.

### Registro histórico anterior à Entrega 3

Integração E2E com PostgreSQL e parceiros externos ainda não executada neste ambiente; testes unitários e estáticos estão incluídos. O DER do PDF foi considerado mais atual que o modelo Astah histórico anexado. Estratégia anti-XSS/armazenamento do refresh token deve ser definida com o frontend. Requisitos de disponibilidade e latência necessitam testes reais.
