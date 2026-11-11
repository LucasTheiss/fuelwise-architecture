# Custos e restrição de provisionamento

Consulta às fontes oficiais em 03/11/2026; estado de recursos atualizado em
11/11/2026. Atlas M0 e Azure SQL foram criados pelo usuário após a revisão das
ofertas. Créditos Azure for Students não são orçamento autorizado. Uma franquia
não comprova custo total zero fora dos limites e configurações selecionados.

**Recursos existentes confirmados pelo usuário:** cluster MongoDB Atlas M0 com
selo FREE e estado Active; Azure SQL Database `fuelwiseDB` com oferta gratuita,
AutoPause ao atingir o limite e cobrança adicional desativada. A tela de revisão
do banco mostrou $0 para compute/storage. O teste integrado foi encerrado e as
conexões SQL foram fechadas. Conferir periodicamente a franquia restante no
portal. Nenhuma Function App, Storage Account dedicada, hospedagem, repositório
público novo ou serviço pago foi provisionado pelo agente.

| Componente | Plano/limites consultados | Uso esperado na demonstração | Risco e proteção | Desativação |
|---|---|---|---|---|
| Postos | MongoDB Atlas M0 Free, cluster ativo em São Paulo conforme portal mostrado pelo usuário | Testes CRUD reais concluídos; pool 5 | Manter tier M0 e limites de acesso; revisar consumo no Atlas; não adicionar extras pagos | Pausar/encerrar pelo Atlas após exportar dados, mediante decisão do usuário |
| Viagens | Azure SQL General Purpose serverless na oferta gratuita; o usuário confirmou Free offer, AutoPause e overage desativado no servidor `fuelwise`/banco `fuelwiseDB` | Testes CRUD/eventos reais concluídos; conexões fechadas após os testes | Respeitar 100.000 vCore-s/mês, 32 GB de dados e 32 GB backup da oferta; o portal mostrou armazenamento máximo de 41,6 GB, portanto não preencher além dos 32 GB cobertos. Reconfirmar franquia e AutoPause | Parar aplicações e conexões; manter AutoPause; excluir somente após backup/autorização |
| Function | Host oficial v4/Node 22 executado localmente em Docker com Azurite | Function participou do smoke ponta a ponta local; nenhuma Function App foi publicada no Azure | Storage/rede não estão automaticamente cobertos pela franquia de execuções. Não provisionar até verificar a assinatura, storage, logs e custo total | Não aplicável à nuvem ainda; avaliar todos os recursos auxiliares antes de publicar |
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

1. Tipo da assinatura e tela de elegibilidade da oferta SQL (o usuário confirmou Azure for Students e a oferta Free aplicada).
2. Confirmar periodicamente que AutoPause/overage-disabled permanecem ativos e que a franquia/storage não foi excedida.
3. Function/Storage/rede/logs com gratuidade comprovada para a assinatura antes de criar a Function App.
4. Quotas e método de pagamento dos provedores de hospedagem.
5. Consentimento separado se qualquer consumo de crédito/cobrança for necessário.

## Fontes

- [Azure SQL Free FAQ](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-tier-faq)
- [Configuração da oferta SQL](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-tier)
- [Azure Functions pricing](https://azure.microsoft.com/en-us/pricing/details/functions/)
- [Static Web Apps pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/static/)
- [Atlas Free limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)
- [Render Free](https://render.com/docs/free)
