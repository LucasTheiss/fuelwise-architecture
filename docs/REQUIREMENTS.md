# Rastreabilidade — FuelWise RF01–RF16

Baseado no documento de arquitetura fornecido. A alteração solicitada troca Java/Spring por Node.js/Express e módulos técnicos por **Vertical Slices**. O PostgreSQL permanece o repositório de dados relacional.

| RF | Função | Slice / API |
|---|---|---|
| 01 | Cadastro de transportadora | `auth/register-carrier`, `POST /carriers/requests` |
| 02 | Cadastro de gerente | `auth/register-carrier` cria account + manager |
| 03 | Cadastro de caminhoneiro | `drivers/create`, `POST /drivers` |
| 04 | Cadastro de veículo | `vehicles/create`, `POST /vehicles` |
| 05 | Cadastro de posto | `stations/create`, `POST /stations` |
| 06 | Tabela histórica de preços | `stations/add-price` e `stations/prices` |
| 07 | Criar viagem motorista-veículo | `trips/start`, `POST /trips` |
| 08 | Localização do veículo | `vehicles/location`, cache e GPS adapter (mock em homologação) |
| 09 | Localizar postos | `stations/list` (raio em km) e `stations/external` (mock) |
| 10 | Visualizar posto | `stations/detail` e `stations/prices` |
| 11 | Painel dos filiados | `stations/list?isAffiliated=true` |
| 12 | Relatórios e gráficos | `analytics/consumption` fornece agregados; frontend renderiza gráficos |
| 13 | Auditoria de pagamentos | `analytics/audit`, `audit_event` |
| 14 | Aprovar/recusar transportadora | `carriers/list-pending` e `carriers/decide` |
| 15 | Pagamento de abastecimento | `fuelings/create/approve`, `payments/pay/get/reconcile` |
| 16 | Denúncias e verificação | `complaints/create/list/moderate` |

## Modelagem SQL

Tabelas: `account`, `administrator`, `manager`, `driver`, `carrier`, `vehicle`, `trip`, `vehicle_location`, `station`, `fuel_price`, `fueling`, `payment`, `complaint`, `fcm_device`, `notification`, `refresh_session`, `audit_event` e `schema_migrations`.

Perfis: `ADMIN`, `MANAGER`, `DRIVER`. Carrier: `PENDING`, `ACTIVE`, `REJECTED`. Trip: `IN_PROGRESS`, `FINISHED`. Fueling: `AWAITING_APPROVAL`, `APPROVED`, `REJECTED`, `PAID`, `PAYMENT_REJECTED`, `PAYMENT_UNKNOWN`. Payment: `PROCESSING`, `APPROVED`, `REJECTED`, `UNKNOWN`. Complaint: `OPEN`, `UNDER_REVIEW`, `RESOLVED`, `REJECTED`. Notification: `PENDING`, `PROCESSING`, `SENT`, `SIMULATED`, `FAILED`.

Cada abastecimento gera **no máximo um pagamento**, cada viagem ativa é exclusiva por motorista e veículo, e cada denúncia aponta exatamente para posto ou pagamento.
