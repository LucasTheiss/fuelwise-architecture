# Software Architecture Canvas — FuelWise Entrega 3

| Bloco | Conteúdo |
|---|---|
| Functional overview | Postos/preços, viagens/frota, indicadores e eventos; identidade e financeiro legado preservados |
| Business context | Pequenas/médias transportadoras; gerentes, motoristas e administradores; redução de controles manuais |
| Quality goals | Isolamento, autorização, persistência confiável, idempotência, testabilidade e custo controlado |
| Organisational constraints | Quatro integrantes, entrega acadêmica, todos falam no vídeo; URLs públicas e documentação rastreável |
| Technical constraints | React, Node, dois microservices, Atlas Free, Azure SQL, Function HTTP, Gateway, Docker, Clean/Vertical Slice/EDA |
| External interfaces | Navegador→Gateway→BFF; BFF→serviços/Function/identidade; serviços→seu próprio banco |
| Architectural hypotheses | Dois domínios extraídos bastam para demonstrar a entrega; ES modules permitem deploy independente; outbox evita broker pago |
| Solution approach | Incrementos com commits, contratos reaproveitados, portas injetadas, SQL parametrizado, remotos runtime, worker idempotente |
| Technical challenges and risks | Gratuidade real, cold start, ponte financeira e migração de dados, polling SQL, recuperação de eventos, captura de evidência pública |
| Decisions and validation | ARC42_DELIVERY3.md, IMPLEMENTATION_PLAN.md, VALIDATION.md; nenhum deploy ou teste inventado |

Canvas representa a implementação desta entrega, não a arquitetura futura de
quatro serviços do PDF original. Material cloud ainda depende dos gates indicados.
