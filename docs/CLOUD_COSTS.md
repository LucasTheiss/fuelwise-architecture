# Custos e limites para a Entrega 3

Atualizado em 11/11/2026. A existência de um plano ou grant gratuito não implica
que todos os serviços auxiliares também sejam gratuitos. Não criar recursos nem
consumir créditos Azure quando o custo total zero não estiver comprovado.

## Recursos existentes

| Recurso | Estado confirmado | Limite/risco | Proteção |
|---|---|---|---|
| MongoDB Atlas | M0 Free, cluster ativo em São Paulo conforme tela enviada pelo usuário; CRUD real validado | Restrições de throughput, armazenamento e conexões do tier compartilhado | Manter M0, poucos dados de demonstração, usuário de menor privilégio e IP allowlist |
| Azure SQL `fuelwiseDB` | Criado pelo usuário na oferta Free do Azure SQL; tela de revisão indicava $0 e oferta de 100.000 vCore-s, 32 GB de dados e 32 GB de backup por mês. Usuário confirmou AutoPause e overage desativado. Teste real concluído. | O uso fora dos limites pode não ser gratuito; `maxSizeBytes` anteriormente observado era 32 GiB, e AutoPause foi configurado para evitar uso depois do limite | Manter AutoPause e overage desativado; conferir portal antes de novo teste; pool SQL limitado; fechar processos; não carregar dados reais |

## Recursos ainda não implantados

| Recurso | Opção avaliada | Situação e motivo para não provisionar |
|---|---|---|
| Frontend | Azure Static Web Apps Free | Plano Free oferece hospedagem estática e TLS automático. Pode ser candidato ao site, mas ainda não foi criado/publicado. Conferir plano Free no portal; não mudar para Standard/Dedicated. |
| Azure Function | Function HTTP separada em Consumption | O grant citado pela Microsoft (1 milhão de execuções e 400.000 GB-s) aplica-se a planos de consumo em assinaturas elegíveis de pagamento por uso. Storage e rede são cobrados à parte. Não está comprovado que a conta Azure for Students do usuário tenha custo total zero para isso. Nenhuma Function App foi criada. |
| Function dentro do Static Web Apps | Managed API HTTP do SWA Free | A documentação consultada lista runtime gerenciado Node 18 e Node 20 Preview; o projeto está configurado para Node 22. Há incompatibilidade não resolvida. Não alterar runtime para versão fora de suporte sem teste. Uma Function existente vinculada tem hospedagem/custos próprios. |
| BFF, serviços e gateway | Nenhum host aprovado | Não há deployment público. Escolher hospedagem exige verificar plano, quotas, egress permitido para Azure SQL/Atlas, TLS, cold start, logs e cobrança excedente. Não foi criado serviço de hospedagem nesta etapa. |
| Banco legado | Sem hospedagem PostgreSQL escolhida | A API original usa PostgreSQL para autenticação e outros slices. O Azure SQL de Viagens não substitui automaticamente esse banco. Usuário pediu priorizar o Azure SQL existente; não criar Neon nem outro banco cloud. |

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

- [Azure SQL Database free offer](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-tier)
- [Azure SQL free tier FAQ](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-tier-faq)
- [Azure Functions pricing — storage is billed separately](https://learn.microsoft.com/en-us/azure/azure-functions/pricing)
- [Static Web Apps plans](https://learn.microsoft.com/en-us/azure/static-web-apps/plans)
- [Static Web Apps API runtimes and constraints](https://learn.microsoft.com/en-us/azure/static-web-apps/apis-functions)
- [MongoDB Atlas M0 restrictions](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)

Confirmações de custo e status do recurso são da data registrada e devem ser
conferidas novamente no portal antes de criar ou publicar recursos.
