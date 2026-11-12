# Custos e limites para a Entrega 3

Atualizado em 11/11/2026. A existência de um plano ou grant gratuito não implica
que todos os serviços auxiliares também sejam gratuitos. Não criar recursos nem
consumir créditos Azure quando o custo total zero não estiver comprovado.

## Recursos existentes

| Recurso | Estado confirmado | Limite/risco | Proteção |
|---|---|---|---|
| MongoDB Atlas | M0 Free, cluster ativo em São Paulo conforme tela enviada pelo usuário; CRUD real validado | Restrições de throughput, armazenamento e conexões do tier compartilhado | Manter M0, poucos dados de demonstração, usuário de menor privilégio e IP allowlist |
| Azure SQL `fuelwiseDB` | Criado pelo usuário na oferta Free do Azure SQL; tela de revisão indicava $0 e oferta de 100.000 vCore-s, 32 GB de dados e 32 GB de backup por mês. Usuário confirmou AutoPause e overage desativado. Teste real concluído. | O uso fora dos limites pode não ser gratuito; `maxSizeBytes` anteriormente observado era 32 GiB, e AutoPause foi configurado para evitar uso depois do limite | Manter AutoPause e overage desativado; conferir portal antes de novo teste; pool SQL limitado; fechar processos; não carregar dados reais |

## Recursos implantados em 12/11/2026

| Recurso | Configuração | Por que é gratuito / proteção |
|---|---|---|
| Ambiente Container Apps `fuelwise-env` | Brazil South, perfil Consumption, sem Log Analytics (`--logs-destination none`) | Plano Consumption tem grant mensal de vCPU-s, GiB-s e requisições; ambiente sem workspace de logs não gera cobrança de ingestão |
| Apps frontend, gateway, bff, stations, trips, function, legacy | 0,25 vCPU/0,5 GiB (legacy 0,5/1 GiB), `minReplicas: 0`, `maxReplicas: 1` | Scale-to-zero: só consome grant durante uso. Legacy espera 30 min antes de escalar a zero; demais, 5 min |
| Azure Function (app `function`) | Host oficial Azure Functions Node 22 em container, chaves em arquivo | Sem Function App, Storage Account ou plano de Functions; usa o mesmo grant do Container Apps |
| Imagens | Docker Hub público `cristhiansk/*`, fixadas por digest | Sem Azure Container Registry |
| Firewall Azure SQL / Atlas | Regras /32 só para IPs de saída observados | Nada aberto para a internet nem para "todos os serviços Azure" |

Não implantados por indisponibilidade ou custo: Static Web Apps (não oferecido
nas regiões permitidas pela policy da assinatura Students: brazilsouth,
chilecentral, canadacentral, mexicocentral, northcentralus), Function App
Consumption/Flex (exige Storage Account cobrado à parte) e PostgreSQL gerenciado
(o legado usa PostgreSQL efêmero dentro do container, por decisão do grupo).

Orçamento do grant (180.000 vCPU-s e 360.000 GiB-s/mês, conferir na página de
billing): cerca de 25 h/mês com os sete apps ativos ao mesmo tempo (2 vCPU, 4 GiB). O Azure SQL Free (100.000 vCore-s/mês) dá cerca de 55 h ativas com
0,5 vCore; cada retomada consome no mínimo o AutoPause de 60 min. Parar a demo e
não deixar abas fazendo polling permite que trips escale a zero e o banco pause.

## Regras antes de provisionar

1. Confirmar no portal o nome e o plano selecionado; revisar a tela **Revisar + criar**.
2. Não habilitar upgrades, autoscale pago, Application Insights, Log Analytics,
   Private Link, NAT Gateway, domínios ou serviços de terceiros sem conferir o preço.
3. No Azure SQL, manter a oferta gratuita, AutoPause e overage desativado. Não
   abrir firewall globalmente; permitir somente a origem necessária.
4. Parar aplicações e conexões após testes para deixar o banco pausar.
5. Se qualquer recurso sair do plano grátis ou consumir créditos, não provisionar
   sem autorização explícita do usuário.

## Fontes oficiais consultadas

- [Azure Container Apps billing — free grant](https://learn.microsoft.com/en-us/azure/container-apps/billing)

- [Azure SQL Database free offer](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-tier)
- [Azure SQL free tier FAQ](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-tier-faq)
- [Azure Functions pricing — storage is billed separately](https://learn.microsoft.com/en-us/azure/azure-functions/pricing)
- [Static Web Apps plans](https://learn.microsoft.com/en-us/azure/static-web-apps/plans)
- [Static Web Apps API runtimes and constraints](https://learn.microsoft.com/en-us/azure/static-web-apps/apis-functions)
- [MongoDB Atlas M0 restrictions](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)

Confirmações de custo e status do recurso são da data registrada e devem ser
conferidas novamente no portal antes de criar ou publicar recursos.
