# Custos e restrição de provisionamento

Consulta às fontes oficiais em 03/11/2026. **Nenhum recurso cloud foi criado.**
Créditos Azure for Students não são orçamento autorizado. A existência de uma
franquia não comprova custo total zero nem elegibilidade da assinatura pessoal.

| Componente | Plano/limites consultados | Uso esperado na demonstração | Risco e proteção | Desativação |
|---|---|---|---|---|
| Postos | MongoDB Atlas Free, um cluster por projeto; limite de armazenamento deve ser conferido no portal | Menos de 100 postos/preços; pool 5 | Selecionar Free explicitamente, sem upgrade, sem extras pagos; usuário restrito ao banco, IPs de saída autorizados | Encerrar cluster após exportar dados, mediante confirmação |
| Viagens | Azure SQL General Purpose serverless com free limit: 100.000 vCore-s/mês, 32 GB dados e 32 GB backup por banco; até 10 bancos | Menos de 100 viagens; sessões curtas | Usar oferta gratuita e AutoPause ao esgotar; nunca BillOverUsage. Pool 3; desligar worker/containers fora das sessões | Parar aplicações e conexões; manter AutoPause; excluir somente após backup/autorização |
| Function | Flex Consumption: franquia anunciada de 250.000 execuções/100.000 GB-s; condições de assinatura aplicáveis | Até 1.000 chamadas curtas | Storage/rede não incluídos na franquia. Zero Always Ready, sem Premium; não provisionar até comprovar todos os custos | Parar Function App; revisar storage/logs separadamente |
| Frontend | Static Web Apps Free: 100 GB banda/assinatura, 0,50 GB storage e 0,25 GB por deploy | Build abaixo de 2 MB; menos de 1 GB transferência | Selecionar Free, sem Standard/Front Door. Limite excedido interrompe site | Excluir app ou desconectar deploy |
| BFF, serviços, gateway e legado | Candidato: Render Free Web Services, 750 horas/mês compartilhadas no workspace | Cinco processos por 20 horas = cerca de 100 horas | Cold start; banda/build podem gerar excedentes com método de pagamento. Sem cartão e sem upgrade; conferir limites da conta, suspender fora da demonstração | Suspender serviços no painel |
| Identidade legada | Candidato: Render Free Postgres, 1 GB, expira em 30 dias | Menos de 100 usuários/veículos | Usado somente pelo legado, nunca como substituto de Azure SQL. Backup antes de expirar | Exportar, depois remover com autorização |
| Eventos | Outbox/auditoria no SQL existente | Poucos eventos por sessão | Polling mantém banco ativo; não executar permanentemente. Sem Service Bus pago | Parar serviço de viagens |
| Docker Hub/GitHub | Repositórios públicos e imagens preparados, não publicados | Três imagens obrigatórias, cinco projetos | Publicação requer revisão de segredos e autorização; limites da conta precisam ser conferidos | Remover/despublicar apenas com autorização |

O enunciado usa “Free 1 DTU”; a oferta atual consultada usa **vCore-segundos**.
Não selecionar SKU pago para reproduzir o texto antigo. A FAQ distingue Azure
for Students Starter (incompatível) de outras ofertas estudantis. Confirmar o
tipo exato da assinatura e a opção gratuita no portal, sem presumir elegibilidade.

A documentação de Functions informa que storage e rede são cobrados à parte e
que franquias têm condições específicas. Portanto a implantação de Function
permanece **bloqueada por comprovação de custo zero**, mesmo com baixo tráfego.
O adaptador Node local não satisfaz a demonstração de Azure Functions na nuvem.

## Evidência necessária antes de criar recursos

1. Tipo da assinatura e tela de elegibilidade da oferta SQL.
2. Estimativa zero, free limit e AutoPause habilitados; sem extras.
3. Function/Storage/rede/logs com gratuidade comprovada para a assinatura.
4. Quotas e método de pagamento dos provedores de hospedagem.
5. Consentimento separado se qualquer consumo de crédito/cobrança for necessário.

## Fontes

- [Azure SQL Free FAQ](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-tier-faq)
- [Configuração da oferta SQL](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-tier)
- [Azure Functions pricing](https://azure.microsoft.com/en-us/pricing/details/functions/)
- [Static Web Apps pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/static/)
- [Atlas Free limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)
- [Render Free](https://render.com/docs/free)
