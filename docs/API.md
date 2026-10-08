# FuelWise REST API v1 — English Naming

Base: `http://localhost:3000/api/v1`. JSON no corpo, `Authorization: Bearer <accessToken>` nas rotas autenticadas. Colunas do PostgreSQL usam `snake_case`; novos campos JSON de entrada usam `camelCase`. Respostas que devolvem registros SQL podem usar as mesmas chaves `snake_case` da persistência. Os valores `numeric` podem vir como strings para preservar precisão.

Erros: `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": { } } }`. Respostas de listagem: `{ "items": [...], "page": 1, "limit": 20 }`. Paginação: `?page=1&limit=20`.

## Auth and carriers

| Verbo | Endpoint | Perfil | Request body / query |
|---|---|---|---|
| POST | `/carriers/requests` | Pública | `{"carrier":{"name":"Example Logistics","legalName":"Example Logistics Ltd.","taxId":"11222333000181"},"manager":{"name":"Test Manager","email":"manager@example.com","password":"Manager@2026"}}` |
| POST | `/auth/login` | Pública | `{"email":"admin@fuelwise.local","password":"LocalTest@2026!"}` |
| POST | `/auth/refresh` | Pública | `{"refreshToken":"..."}` |
| POST | `/auth/logout` | Pública | `{"refreshToken":"..."}` |
| GET | `/auth/me` | Logado | — |
| GET | `/admin/carriers/requests` | ADMIN | `?status=PENDING&page=1&limit=20` |
| PATCH | `/admin/carriers/:id/decision` | ADMIN | `{"decision":"APPROVE"}` ou `{"decision":"REJECT","reason":"Required reason"}` |

Managers cannot authenticate before their carrier is `ACTIVE`. ADMIN accounts can only be seeded from a trusted environment; no public admin registration endpoint.

## Drivers, vehicles and trips

| Verbo | Endpoint | Perfil | Request body / query |
|---|---|---|---|
| POST | `/drivers` | MANAGER | `{"name":"Demo Driver","email":"driver@example.com","password":"Driver@2026!","driverLicense":"12345678901"}` |
| GET | `/drivers` | MANAGER | `?page=1&limit=20` |
| POST | `/vehicles` | MANAGER | `{"plate":"ABC1D23","model":"Truck X"}` |
| GET | `/vehicles` | MANAGER | Paginação |
| GET | `/vehicles/:id/location` | ADMIN/MANAGER/DRIVER | Mock GPS: `origin: "MOCK"`, `simulated: true`; driver requires own active trip |
| POST | `/trips` | MANAGER | `{"driverId":"<uuid>","vehicleId":"<uuid>"}` |
| GET | `/trips` | MANAGER/DRIVER | `?status=IN_PROGRESS` ou `FINISHED` |
| PATCH | `/trips/:id/finish` | MANAGER/DRIVER | Sem corpo |

## Stations and fuel prices

| Verbo | Endpoint | Perfil | Request body / query |
|---|---|---|---|
| POST | `/stations` | ADMIN | `{"name":"Demo Local Station","address":"Local Demo 123","latitude":-25.43,"longitude":-49.27,"isAffiliated":true}` |
| GET | `/stations` | Logado | `?isAffiliated=true&latitude=-25.43&longitude=-49.27&radiusKm=2` |
| GET | `/stations/external` | Logado | Mock: `{"items":[...],"origin":"MOCK","simulated":true}` |
| GET | `/stations/:id` | Logado | Preços e dados do posto local |
| GET | `/stations/:id/prices` | Logado | `?type=DIESEL_S10` e paginação |
| POST | `/stations/:id/prices` | ADMIN | `{"fuelType":"DIESEL_S10","pricePerLiter":5.679}` |

`fuelType`: `DIESEL_S10`, `DIESEL_S500`, `GASOLINE`, `ETHANOL`, `ARLA32`. **Registros externos mock têm identificadores fictícios e não são parte do PostgreSQL: cadastre uma station local para realizar fueling.**

## Fuelings and payments

| Verbo | Endpoint | Perfil | Request body / query |
|---|---|---|---|
| POST | `/fuelings` | DRIVER | `{"tripId":"<uuid>","stationId":"<uuid>","fuelType":"DIESEL_S10","liters":120.5}` |
| GET | `/fuelings` | MANAGER/DRIVER | `?status=AWAITING_APPROVAL` e paginação |
| PATCH | `/fuelings/:id/decision` | MANAGER | `{"decision":"APPROVE"}` ou `{"decision":"REJECT"}` |
| POST | `/fuelings/:id/payment` | DRIVER | Sem corpo, idempotente. Em mock, `payment.status=APPROVED`, `simulated=true` |
| GET | `/payments/:id` | ADMIN/MANAGER/DRIVER | Escopo do tenant/driver |
| POST | `/admin/payments/:id/reconcile` | ADMIN | Sem corpo; provider deve confirmar estado |

Fluxo: `AWAITING_APPROVAL` → `APPROVED` → `PAID` (ou `PAYMENT_REJECTED`/`PAYMENT_UNKNOWN`). Transação: `PROCESSING` → `APPROVED`/`REJECTED`/`UNKNOWN`. Em falha ambígua, não repita a cobrança; execute reconciliação pelo endpoint admin.

## Analytics, complaints and notifications

| Verbo | Endpoint | Perfil | Request body / query |
|---|---|---|---|
| GET | `/analytics/fuelings` | ADMIN/MANAGER | `?startDate=2026-10-01&endDate=2026-10-31`, ADMIN pode filtrar `carrierId` |
| GET | `/audit/payments` | ADMIN/MANAGER | Paginação; ADMIN pode filtrar `carrierId` |
| POST | `/complaints` | Logado | `{"stationId":"<uuid>","description":"..."}` **ou** `{"paymentId":"<uuid>","description":"..."}` |
| GET | `/complaints` | Logado | `?status=OPEN` ou `UNDER_REVIEW`, `RESOLVED`, `REJECTED` |
| PATCH | `/admin/complaints/:id/moderate` | ADMIN | `{"status":"UNDER_REVIEW","note":"Justification"}` |
| GET | `/notifications` | Logado | Caixa de notificações persistidas do usuário |
| POST | `/notifications/device` | Logado | `{"token":"at-least-20-characters"}` (opcional no mock) |

O outbox em mock registra `notification.status=SIMULATED`. Isso indica apenas simulação: **nenhuma notificação push foi enviada.**

## Health and cURL

```bash
curl http://localhost:3000/health/live
curl http://localhost:3000/health/ready
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@fuelwise.local","password":"LocalTest@2026!"}'
```

## Convenções

Nomes de arquivos/pastas e entidades/colunas SQL em inglês. Os contratos JSON de entrada são `camelCase`; objetos retornados diretamente do `pg` podem possuir propriedades `snake_case`. Para um frontend 100% `camelCase`, adicione explicitamente uma camada de serialização/DTO de respostas. Contratos HTTP de gateways externos são **propostos**, não especificações oficiais de fornecedores.
