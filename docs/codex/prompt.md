# PROJETO FUELWISE — IMPLEMENTAÇÃO COMPLETA DA ENTREGA 3

Você é um engenheiro de software sênior especializado em Node.js, Express, React, Microservices, BFF, Microfrontends, Azure Functions, Azure SQL Database, MongoDB Atlas, Clean Architecture, Vertical Slice Architecture, Event-Driven Architecture, Docker e Cloud Computing.

Sua tarefa é **analisar o repositório atual do FuelWise, identificar o que já foi implementado e desenvolver tudo o que falta para atender aos requisitos da Entrega 3 da disciplina Arquitetura e Soluções Cloud da PUCPR**.

O projeto já possui uma implementação significativa utilizando Vertical Slice e Clean Architecture.

**NÃO RECRIE O PROJETO DO ZERO. ANALISE O REPOSITÓRIO EXISTENTE E APROVEITE AO MÁXIMO O CÓDIGO ATUAL.**

O objetivo é entregar uma aplicação distribuída funcional e demonstrável, com todos os componentes exigidos pelo professor.

---

# 1. CONTEXTO DO PROJETO

O FuelWise é uma plataforma web voltada para transportadoras de pequeno e médio porte, com foco no gerenciamento de combustível, viagens, pagamentos e gestão da frota.

O sistema permite:

- Cadastrar transportadoras.
- Cadastrar gerentes e caminhoneiros.
- Gerenciar veículos.
- Cadastrar e consultar postos de combustível.
- Gerenciar preços dos combustíveis.
- Criar e acompanhar viagens.
- Registrar abastecimentos.
- Aprovar abastecimentos.
- Realizar pagamentos.
- Consultar relatórios e auditorias.
- Registrar denúncias.
- Gerenciar notificações.

Segundo a documentação anterior, o backend utiliza:

- Node.js 22.
- Express.
- JavaScript ES Modules.
- PostgreSQL 16.
- Zod.
- JWT.
- Docker e Docker Compose.
- Vertical Slice Architecture.
- Clean Architecture no núcleo financeiro.
- Testes unitários e de arquitetura.

A documentação descreve 34 Vertical Slices distribuídos em 11 domínios.

Estrutura documentada:

```text
src/
  app.js
  server.js
  domain/
  shared/
    auth/
    db/
    http/
    integrations/
    notifications/
  slices/
    auth/
    carriers/
    drivers/
    vehicles/
    trips/
    stations/
    fuelings/
    payments/
    analytics/
    complaints/
    notifications/
```

Essa estrutura deve servir apenas como referência inicial.

**A implementação real do repositório é a fonte de verdade.**

Não presuma que tudo está funcionando apenas porque aparece na documentação.

---

# 2. PRIMEIRA ETAPA — ANALISAR O REPOSITÓRIO EXISTENTE

Antes de alterar qualquer código, analise o repositório inteiro.

Identifique:

- Estrutura atual.
- Dependências.
- Linguagens e frameworks.
- Vertical Slices existentes.
- Regras de negócio implementadas.
- Endpoints disponíveis.
- Banco de dados e migrations.
- Autenticação e autorização.
- Integrações externas.
- Testes existentes.
- Dockerfiles e Docker Compose.
- Documentação Swagger.
- Organização do código.
- Funcionalidades completas.
- Funcionalidades incompletas.
- Recursos que podem ser reutilizados.

Verifique especialmente os domínios:

```text
auth
carriers
drivers
vehicles
trips
stations
fuelings
payments
analytics
complaints
notifications
```

Execute os testes existentes antes de modificar o projeto.

Crie o documento:

`docs/IMPLEMENTATION_PLAN.md`

Ele deve conter:

- Diagnóstico do projeto.
- Funcionalidades existentes.
- Funcionalidades pendentes.
- Arquitetura atual.
- Arquitetura proposta.
- Plano de migração.
- Arquivos que serão reaproveitados.
- Novos componentes necessários.
- Riscos e dependências.
- Checklist de implementação.

Depois da análise, prossiga com a implementação.

Não pare apenas para perguntar se pode continuar com tarefas normais de desenvolvimento.

Peça autorização somente para operações destrutivas, criação de recursos pagos, publicação de informações sensíveis ou decisões de infraestrutura que possam gerar cobranças.

---

# 3. REQUISITOS OBRIGATÓRIOS DA ENTREGA 3

A aplicação deve implementar:

1. Microfrontend em React ou Angular.
2. BFF em Node.js.
3. Microserviço 1 com MongoDB Atlas Free Tier.
4. Microserviço 2 com Azure SQL Database.
5. Azure Function HTTP Trigger.
6. API Gateway.
7. Clean Architecture.
8. Vertical Slice Architecture.
9. Event-Driven Architecture.
10. Integração com múltiplos bancos.
11. Testes unitários.
12. Testes de arquitetura.
13. Docker.
14. Docker Hub.
15. Swagger/OpenAPI.
16. Repositórios públicos no GitHub.
17. Deploy acessível pela internet.
18. Documentação ARC42 atualizada.
19. Diagramas C4.
20. Software Architecture Canvas.
21. Evidências e roteiro de apresentação.

A implementação deve priorizar **um fluxo completo de ponta a ponta**, com todas as tecnologias funcionando, sem precisar migrar imediatamente todas as funcionalidades antigas.

O sistema atual deve continuar preservado.

---

# 4. RESTRIÇÃO FINANCEIRA — AZURE FOR STUDENTS

O responsável pelo projeto utiliza a assinatura **Azure for Students**.

O projeto deve utilizar exclusivamente opções gratuitas ou recursos cuja utilização dentro da franquia gratuita tenha sido comprovada.

**Não existe autorização para contratar planos pagos, realizar upgrades ou gerar cobranças.**

Regras obrigatórias:

- Utilizar MongoDB Atlas Free Tier.
- Utilizar a oferta gratuita elegível do Azure SQL Database.
- Utilizar Azure Functions em uma modalidade gratuita compatível com Azure for Students.
- Priorizar Azure Static Web Apps Free para o frontend.
- Buscar hospedagem gratuita para BFF e microservices.
- Não criar serviços Premium.
- Não habilitar recursos com cobrança recorrente.
- Não provisionar recursos pagos automaticamente.
- Evitar serviços auxiliares desnecessários.
- Não consumir créditos estudantis sem autorização.
- Configurar limites de requisições e uso de recursos quando possível.
- Não ativar escalabilidade paga automática.
- Verificar custos de armazenamento, tráfego, logs e recursos auxiliares.
- Não assumir que um serviço é totalmente gratuito apenas por possuir uma franquia Free.

Antes do deploy, criar:

`docs/CLOUD_COSTS.md`

Documentar:

- Serviço.
- Provedor.
- Plano.
- Limites gratuitos.
- Consumo esperado.
- Riscos de cobrança.
- Compatibilidade com Azure for Students.
- Configurações para evitar custos.
- Procedimento para desativar o recurso.

Se não for possível confirmar que um recurso pode ser utilizado dentro das condições autorizadas, prepare o código e as instruções, mas não realize o provisionamento.

---

# 5. ARQUITETURA DA SOLUÇÃO

A aplicação deve seguir este fluxo:

```text
                        USUÁRIO
                           |
                           v
                  MICROFRONTEND REACT
                           |
                           v
                       API GATEWAY
                           |
                           v
                       BFF NODE.JS
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
       MICROSERVICE 1  MICROSERVICE 2  AZURE FUNCTION
             |             |          HTTP TRIGGER
             v             v
       MONGODB ATLAS   AZURE SQL DATABASE
        FREE TIER        FREE OFFER
```

A arquitetura deve respeitar as seguintes regras:

- O frontend não acessa diretamente os microservices.
- O frontend não acessa diretamente os bancos.
- O frontend consome o BFF por meio do API Gateway.
- O BFF consulta os microservices e a Azure Function.
- Cada microservice possui seu próprio banco.
- Um microservice não pode acessar diretamente o banco do outro.
- O BFF não acessa bancos diretamente.
- O Gateway é responsável pelo roteamento e controles de entrada.
- O BFF concentra a lógica de agregação e adaptação para o frontend.
- A Azure Function executa uma regra real utilizada pelo sistema.
- A Event-Driven Architecture deve possuir publicação e consumo real de eventos.

Não implementar apenas simulações desconectadas.

Os componentes devem trocar dados por interfaces definidas.

---

# 6. MICROSERVIÇO 1 — MONGODB ATLAS

**Requisito obrigatório do professor:**

- Banco: MongoDB Atlas (Free Tier).
- Responsável por um domínio.
- CRUD completo.
- Swagger documentado.

## Domínio sugerido: Postos de Combustível

Analise o domínio `stations` existente.

Reaproveite suas regras e funcionalidades sempre que possível.

O serviço deve permitir:

- Cadastrar posto.
- Listar postos.
- Buscar posto por ID.
- Atualizar posto.
- Excluir ou desativar posto.
- Consultar informações do posto.
- Gerenciar preços dos combustíveis, quando aplicável.

Endpoints sugeridos:

```http
POST   /api/stations
GET    /api/stations
GET    /api/stations/:id
PUT    /api/stations/:id
DELETE /api/stations/:id
```

Pode utilizar rotas diferentes se isso permitir preservar os contratos existentes.

## Requisitos técnicos

- Node.js com Express.
- MongoDB Atlas Free Tier.
- Driver oficial MongoDB ou Mongoose.
- Clean Architecture.
- Vertical Slice.
- Validação de entrada.
- Tratamento de erros.
- Identificadores consistentes.
- Testes unitários.
- Testes de integração.
- Swagger/OpenAPI.
- Dockerfile.
- Variáveis de ambiente.
- Endpoint de health check.
- Logs estruturados.

Não utilizar MongoDB local como substituto da integração exigida para a demonstração final.

O MongoDB local pode ser utilizado apenas como ferramenta auxiliar de desenvolvimento.

## Persistência

O serviço deve utilizar uma conexão real com MongoDB Atlas.

Exemplo de configuração:

```env
MONGODB_URI=
MONGODB_DATABASE=fuelwise_stations
```

Não armazenar connection strings reais no repositório.

A persistência deve ocorrer por meio de repositórios e interfaces, sem acoplamento das regras de domínio ao MongoDB.

---

# 7. MICROSERVIÇO 2 — AZURE SQL DATABASE

**Requisito obrigatório do professor:**

- Banco: Azure SQL Database (Free 1 DTU).
- Responsável por outro domínio.
- CRUD completo.
- Swagger documentado.

**IMPORTANTE: O BANCO DESTE MICROSERVIÇO DEVE SER O AZURE SQL DATABASE. NÃO SUBSTITUA POR POSTGRESQL, MYSQL, SQLITE OU SQL SERVER HOSPEDADO EM OUTRO PROVEDOR NA DEMONSTRAÇÃO FINAL.**

O enunciado utiliza a expressão "Free 1 DTU".

Antes do provisionamento, verifique qual oferta gratuita do Azure SQL Database está efetivamente disponível na assinatura Azure for Students.

Caso a modalidade gratuita atual utilize outro modelo de capacidade ou limite, como vCore, documente a diferença e utilize a oferta gratuita oficial elegível.

Não contratar planos pagos.

Não selecionar SKUs pagos para reproduzir literalmente a expressão "1 DTU".

## Domínio sugerido: Viagens

Analise o domínio `trips` existente.

Reaproveite as regras atuais sempre que possível.

O serviço deve permitir:

- Criar viagem.
- Listar viagens.
- Consultar viagem por ID.
- Atualizar informações permitidas.
- Finalizar viagem.
- Cancelar viagem, caso a regra existente permita.
- Excluir ou desativar registros conforme a regra de negócio.

Endpoints sugeridos:

```http
POST   /api/trips
GET    /api/trips
GET    /api/trips/:id
PUT    /api/trips/:id
DELETE /api/trips/:id
```

Também implementar os endpoints de transição de status necessários.

## Requisitos técnicos

- Node.js com Express.
- Azure SQL Database.
- Driver compatível com SQL Server, preferencialmente `mssql`.
- Clean Architecture.
- Vertical Slice.
- Consultas parametrizadas.
- Migrations SQL.
- Transações quando necessárias.
- Validação de entrada.
- Tratamento de erros.
- Testes unitários.
- Testes de integração.
- Swagger/OpenAPI.
- Dockerfile.
- Health check.
- Configuração por variáveis de ambiente.

## Configuração

Exemplo:

```env
AZURE_SQL_SERVER=
AZURE_SQL_DATABASE=
AZURE_SQL_USER=
AZURE_SQL_PASSWORD=
AZURE_SQL_PORT=1433
```

Utilizar conexão criptografada com validação apropriada do certificado.

Não desabilitar validação TLS em produção.

Configurar connection pooling com limites conservadores, respeitando o banco gratuito.

## Restrições importantes

- O banco deve ser realmente Azure SQL Database.
- Não utilizar dados em memória como persistência principal.
- Não conectar o frontend diretamente ao banco.
- Não compartilhar o banco com o microservice MongoDB.
- Não acessar diretamente tabelas do PostgreSQL legado.
- Não utilizar credenciais hardcoded.
- Não realizar migrations destrutivas sem autorização.
- Não criar instâncias pagas automaticamente.

Preservar as regras de negócio do domínio de viagens.

---

# 8. PRESERVAÇÃO DO SISTEMA EXISTENTE

A implementação atual do FuelWise possui funcionalidades que não precisam ser completamente migradas nesta entrega.

Não remover:

- Autenticação existente.
- Controle por perfil.
- Controle por transportadora.
- Regras de abastecimento.
- Regras de pagamento.
- Idempotência.
- Auditoria.
- Outbox.
- Adaptadores de integração.
- Testes existentes.
- Outros Vertical Slices que estejam funcionando.

Os dois microservices devem assumir seus respectivos domínios de maneira consistente.

Evitar manter duas fontes de verdade independentes para as mesmas entidades.

Se algum slice legado precisar continuar funcionando, adapte sua comunicação para consultar o serviço responsável.

Documente claramente quais domínios foram extraídos e quais permanecem na aplicação legada.

Não tentar reescrever todos os 34 slices apenas para satisfazer a demonstração.

Priorize o fluxo completo exigido pela Entrega 3.

---

# 9. CLEAN ARCHITECTURE E VERTICAL SLICE

Cada microservice deve aplicar Clean Architecture e Vertical Slice simultaneamente.

Estrutura sugerida:

```text
src/
  domain/
    entities/
    rules/
    errors/

  application/
    ports/
    shared/

  infrastructure/
    database/
    repositories/

  api/
    middleware/
    documentation/

  features/
    create/
      route.js
      useCase.js
      schema.js

    list/
      route.js
      useCase.js

    get/
      route.js
      useCase.js

    update/
      route.js
      useCase.js

    delete/
      route.js
      useCase.js
```

Adapte a estrutura se o repositório já possuir um padrão melhor.

## Regras arquiteturais

- Domain não depende de Express.
- Domain não depende de MongoDB.
- Domain não depende de Azure SQL.
- Application depende de abstrações.
- Infrastructure implementa as portas.
- API realiza validação e transporte HTTP.
- Cada feature possui responsabilidades bem definidas.
- Usar injeção de dependências.
- Evitar dependências circulares.
- Evitar duplicação de regras de negócio.
- Reutilizar o domínio existente quando possível.

Implementar testes de arquitetura que validem essas dependências.

---

# 10. BFF — BACKEND FOR FRONTEND

Criar um BFF independente utilizando Node.js.

Preferencialmente utilizar Express para manter compatibilidade com o stack existente.

## Responsabilidades

- Agregação de dados.
- Proxy de requisições CRUD.
- Comunicação com Microservice 1.
- Comunicação com Microservice 2.
- Comunicação com Azure Function.
- Autenticação e propagação segura do contexto.
- Tratamento de erros.
- Timeouts.
- Respostas padronizadas.
- Documentação Swagger.

## Endpoint obrigatório

```http
GET /aggregated-data
```

Esse endpoint deve consumir obrigatoriamente:

1. Microservice MongoDB.
2. Microservice Azure SQL.
3. Azure Function HTTP Trigger.

O BFF deve retornar os resultados em um único response JSON.

Exemplo ilustrativo:

```json
{
  "stations": [
    {
      "id": "station-001",
      "name": "Posto Exemplo",
      "city": "Curitiba"
    }
  ],
  "trips": [
    {
      "id": "trip-001",
      "status": "ACTIVE"
    }
  ],
  "analytics": {
    "totalStations": 1,
    "totalTrips": 1,
    "activeTrips": 1
  }
}
```

O JSON final deve refletir os contratos reais da aplicação.

Não utilizar valores fixos para simular respostas reais.

## Implementação

- Realizar chamadas concorrentes quando apropriado.
- Configurar timeouts.
- Tratar falhas parciais.
- Preservar contexto de autenticação.
- Não expor segredos.
- Evitar acoplamento às implementações internas dos serviços.
- Testar a agregação.
- Documentar com Swagger.

Também implementar rotas de proxy para os CRUDs dos microservices.

---

# 11. AZURE FUNCTION — HTTP TRIGGER

Implementar uma Azure Function em Node.js.

A Function deve executar uma regra real utilizada pelo FuelWise.

## Regra sugerida

Calcular indicadores de viagens e postos de combustível.

Exemplos:

- Total de viagens.
- Viagens ativas.
- Viagens concluídas.
- Quantidade de postos.
- Indicadores financeiros ou de consumo, caso existam dados suficientes.

A Function recebe informações enviadas pelo BFF e retorna o resultado calculado.

Não deve depender diretamente dos bancos dos microservices.

## Requisitos

- Azure Functions.
- HTTP Trigger.
- Node.js.
- Endpoint HTTP.
- Validação de entrada.
- Tratamento de erros.
- Testes unitários.
- Documentação OpenAPI.
- Configuração por variáveis de ambiente.
- Integração real com o BFF.

## Restrições financeiras

Utilizar somente uma modalidade compatível com a assinatura Azure for Students e com a restrição de gastos.

Verificar:

- Franquia gratuita de execuções.
- Memória e duração.
- Custos da conta de armazenamento.
- Custos de observabilidade.
- Custos de rede.
- Requisitos mínimos de infraestrutura.
- Possibilidade de suspender ou remover o serviço.

Evitar:

- Always On.
- Instâncias dedicadas.
- Planos Premium.
- Execuções recorrentes desnecessárias.
- Logging excessivo.

Preparar a execução local com Azure Functions Core Tools.

Preparar os comandos de deploy e configuração, mas não provisionar recursos sem confirmar a elegibilidade e os custos.

---

# 12. MICROFRONTEND REACT

Implementar uma interface web funcional utilizando React.

Priorizar React + Vite.

Pode utilizar TypeScript se for adequado à estrutura existente.

## Funcionalidades mínimas

- Layout principal.
- Navegação.
- Dashboard.
- Listagem de postos.
- Cadastro de postos.
- Edição de postos.
- Exclusão/desativação.
- Listagem de viagens.
- Cadastro de viagens.
- Edição de viagens.
- Finalização/cancelamento.
- Visualização de dados agregados.
- Indicadores calculados pela Function.
- Loading.
- Tratamento de erros.
- Feedback de operações.

Preservar a identidade do FuelWise.

## Arquitetura de microfrontend

Não considerar uma SPA com múltiplas páginas automaticamente um microfrontend.

Implementar ao menos dois módulos frontend separados, além do shell.

Estrutura sugerida:

```text
frontend/
  shell/
  stations/
  trips/
```

O shell deve carregar os módulos em tempo de execução.

Pode utilizar Module Federation ou alternativa tecnicamente equivalente.

A solução deve demonstrar separação real de módulos, com contratos claros e possibilidade de implantação independente.

Todos os módulos devem consumir o BFF por meio do Gateway.

Nenhum módulo pode acessar diretamente os microservices.

## Hospedagem

Priorizar Azure Static Web Apps Free, desde que seja possível publicar os módulos necessários dentro das condições gratuitas.

Considerar alternativas gratuitas caso sejam mais adequadas.

O frontend final deve possuir URL pública HTTPS.

---

# 13. API GATEWAY

Implementar um API Gateway real.

O enunciado considera esse componente obrigatório.

Pode utilizar AWS API Gateway, desde que seja possível demonstrá-lo sem gerar custos não autorizados.

Também pode utilizar uma alternativa gratuita, como um gateway baseado em Cloudflare Workers ou reverse proxy.

## Responsabilidades

- Entrada centralizada.
- Roteamento.
- HTTPS.
- CORS.
- Rate limiting.
- Segurança básica.
- Encaminhamento para o BFF.

Não colocar regras de negócio no Gateway.

Não confundir API Gateway com BFF.

Preparar documentação das rotas e configuração.

O Gateway deve possuir uma URL pública utilizada pelo frontend.

---

# 14. EVENT-DRIVEN ARCHITECTURE

Implementar um fluxo real orientado a eventos.

A documentação anterior já descreve uma abordagem de outbox para notificações.

Analise se essa implementação pode ser reaproveitada.

## Evento sugerido

`TripCreated`

Fluxo:

```text
Usuário cria viagem
        |
        v
Microservice de Viagens
        |
        v
Azure SQL Database
        |
        v
Evento TripCreated
        |
        v
Publicação assíncrona
        |
        v
Consumidor
        |
        v
Auditoria / projeção / notificação
```

## Requisitos

- Evento gerado por operação real.
- Payload definido.
- Identificador único.
- Timestamp.
- Versionamento.
- Publicador.
- Consumidor.
- Tratamento de falhas.
- Idempotência.
- Logs.
- Testes.

Priorizar uma solução gratuita.

Pode utilizar o padrão Transactional Outbox com um worker consumidor, caso seja adequado.

Não considerar apenas um registro em tabela como implementação completa da Event-Driven Architecture.

Deve existir efetivamente publicação e processamento assíncrono.

## Documentação

Documentar os eventos utilizando AsyncAPI.

Descrever:

- Nome do evento.
- Payload.
- Publicador.
- Consumidor.
- Política de retry.
- Tratamento de duplicidade.
- Fluxo de execução.

---

# 15. DOCKERIZAÇÃO

Criar Dockerfiles independentes para:

- BFF.
- Microservice MongoDB.
- Microservice Azure SQL.

Criar Docker Compose para desenvolvimento local.

O Compose pode utilizar bancos locais para testes, mas a demonstração final deve utilizar:

- MongoDB Atlas Free Tier.
- Azure SQL Database.

## Requisitos Docker

- Builds reproduzíveis.
- Imagens pequenas.
- `.dockerignore`.
- Variáveis de ambiente.
- Health checks.
- Sem credenciais nas imagens.
- Sem arquivos `.env` reais.
- Usuário não root quando viável.

Preparar publicação no Docker Hub.

Padrão sugerido:

```text
<dockerhub-user>/fuelwise-bff:v1
<dockerhub-user>/fuelwise-mongo-service:v1
<dockerhub-user>/fuelwise-sql-service:v1
```

Preparar scripts para:

```bash
docker build
docker login
docker push
```

Não executar publicação sem credenciais e autorização.

---

# 16. TESTES UNITÁRIOS E DE ARQUITETURA

Implementar testes para as principais regras.

## Testes unitários

- Criação de posto.
- Consulta de posto.
- Atualização de posto.
- Exclusão/desativação de posto.
- Criação de viagem.
- Consulta de viagem.
- Atualização de viagem.
- Finalização/cancelamento.
- Regras da Azure Function.
- Agregação do BFF.
- Eventos.
- Validação de dados.

## Testes de arquitetura

Verificar:

- Domain não depende de Infrastructure.
- Domain não depende de Express.
- Application não depende diretamente de drivers de banco.
- Microservices não acessam bancos de outros serviços.
- BFF não acessa bancos.
- Frontend não acessa microservices diretamente.
- Não existem dependências circulares indevidas.
- As regras de negócio permanecem desacopladas de frameworks.

## Testes de integração

Cobrir:

- CRUD com MongoDB.
- CRUD com Azure SQL.
- BFF consumindo os microservices.
- BFF consumindo a Azure Function.
- `/aggregated-data`.
- Publicação e consumo de eventos.
- Autenticação e autorização nos endpoints relevantes.

Mocks são permitidos em testes isolados.

A demonstração cloud deve utilizar integrações reais.

---

# 17. SWAGGER / OPENAPI

Disponibilizar Swagger para:

- BFF.
- Microservice MongoDB.
- Microservice Azure SQL.

Documentar a Azure Function usando OpenAPI, quando aplicável.

Incluir:

- Endpoints.
- Métodos HTTP.
- Parâmetros.
- Request bodies.
- Response bodies.
- Autenticação.
- Erros.
- Exemplos.

Preparar URLs públicas para acesso à documentação.

Os eventos devem possuir documentação AsyncAPI.

---

# 18. REPOSITÓRIOS PÚBLICOS NO GITHUB

Atualmente o FuelWise está em um único repositório.

Você pode reorganizar a estrutura para permitir a publicação separada.

Preparar cinco projetos independentes:

```text
fuelwise-frontend
fuelwise-bff
fuelwise-microservice-mongo
fuelwise-microservice-sql
fuelwise-azure-function
```

Preservar o histórico do repositório original sempre que possível.

Não criar repositórios públicos sem autorização.

Preparar os projetos para publicação independente.

## README.md

Cada projeto deve possuir um README com:

- Descrição da aplicação.
- Arquitetura.
- Tecnologias utilizadas.
- Como executar localmente.
- Variáveis de ambiente.
- Docker.
- Testes.
- Swagger.
- Deploy.
- URLs públicas, quando disponíveis.
- Integração com outros componentes.
- Nomes dos integrantes.

Integrantes:

- Artur Ribeiro de Souza.
- Cristhian Rezende.
- Lucas Andriani Theiss.
- Vinicius da Rosa Padilha.

Não publicar credenciais, tokens ou connection strings.

---

# 19. DOCUMENTAÇÃO ARC42 — ENTREGA 3

A documentação anterior utiliza o modelo ARC42.

Atualize a documentação para refletir a arquitetura realmente implementada.

Preparar material para todas as seções:

1. Introdução e objetivos.
2. Restrições arquiteturais.
3. Contexto e escopo.
4. Estratégia de solução.
5. Visão de blocos de construção.
6. Visão de tempo de execução.
7. Visão de implantação.
8. Conceitos transversais.
9. Decisões arquiteturais.
10. Requisitos de qualidade.
11. Riscos e débitos técnicos.

Preservar a rastreabilidade dos requisitos funcionais existentes.

## Links obrigatórios no documento

Preparar campos e registrar os links reais de:

- GitHub dos cinco projetos.
- Docker Hub das imagens.
- Swagger BFF.
- Swagger Microservice MongoDB.
- Swagger Microservice Azure SQL.
- Documentação dos eventos.
- Frontend.
- API Gateway.
- Azure Function.
- Vídeo no YouTube.

Não inventar links.

## C4 Model

Atualizar:

- Diagrama de Contexto.
- Diagrama de Contêineres.
- Diagrama de Componentes.

Produzir diagramas coerentes com o código.

## Canvas

Atualizar o Software Architecture Canvas.

## Evidências

Preparar uma estrutura de screenshots para:

- Swagger BFF.
- Swagger MongoDB.
- Swagger Azure SQL.
- Frontend funcionando.
- API Gateway.
- Azure Function.
- Endpoint agregado.
- Fluxo dos eventos.

Capturar evidências reais quando os serviços estiverem funcionando.

Não gerar screenshots fictícios.

---

# 20. VÍDEO DE APRESENTAÇÃO

Criar o arquivo:

`docs/DEMO_SCRIPT.md`

O vídeo será publicado no YouTube como não listado.

Todos os quatro integrantes devem falar.

A apresentação deve demonstrar **URLs públicas da internet, não localhost**.

## Fluxo obrigatório da demonstração

1. Abrir o frontend em URL pública.
2. Mostrar o API Gateway.
3. Demonstrar chamadas passando pelo BFF.
4. Cadastrar um posto.
5. Consultar, editar e excluir/desativar o posto.
6. Mostrar os dados no MongoDB Atlas.
7. Criar uma viagem.
8. Consultar, editar e finalizar a viagem.
9. Mostrar os dados no Azure SQL Database.
10. Chamar `/aggregated-data`.
11. Demonstrar que o BFF consumiu os dois microservices.
12. Demonstrar a chamada real à Azure Function.
13. Demonstrar o resultado agregado no frontend.
14. Gerar e consumir um evento.
15. Mostrar os Swagger.
16. Explicar a arquitetura distribuída.

Organizar o roteiro para ser dividido entre os quatro integrantes.

Não publicar o vídeo automaticamente.

---

# 21. ESTRATÉGIA DE IMPLEMENTAÇÃO

Execute por fases.

## Fase A — Diagnóstico

- Analisar repositório.
- Executar testes existentes.
- Identificar os slices reutilizáveis.
- Gerar `IMPLEMENTATION_PLAN.md`.

## Fase B — Microservice MongoDB

- Extrair o domínio escolhido.
- Criar API independente.
- Implementar CRUD.
- Integrar MongoDB Atlas.
- Criar Swagger.
- Criar testes.
- Criar Dockerfile.

## Fase C — Microservice Azure SQL

- Extrair o segundo domínio.
- Criar API independente.
- Implementar CRUD.
- Criar migrations.
- Integrar Azure SQL Database.
- Criar Swagger.
- Criar testes.
- Criar Dockerfile.

## Fase D — BFF

- Implementar proxies.
- Implementar agregação.
- Criar `/aggregated-data`.
- Criar Swagger.
- Criar testes.

## Fase E — Azure Function

- Implementar HTTP Trigger.
- Criar regra de negócio.
- Integrar com o BFF.
- Criar testes.
- Preparar deploy gratuito.

## Fase F — API Gateway

- Configurar entrada centralizada.
- Implementar roteamento.
- Configurar HTTPS, CORS e rate limiting.
- Integrar com BFF.

## Fase G — Microfrontend

- Criar shell React.
- Criar módulo de postos.
- Criar módulo de viagens.
- Implementar dashboard.
- Integrar com Gateway/BFF.
- Preparar deploy público.

## Fase H — Event-Driven Architecture

- Implementar publicação de eventos.
- Implementar consumidor.
- Garantir idempotência.
- Criar testes.
- Documentar com AsyncAPI.

## Fase I — Docker, CI e testes

- Validar Dockerfiles.
- Validar Compose.
- Executar testes.
- Corrigir problemas.
- Preparar Docker Hub.
- Preparar pipelines.

## Fase J — Documentação

- Atualizar ARC42.
- Atualizar C4.
- Atualizar Canvas.
- Preparar READMEs.
- Preparar checklist.
- Preparar roteiro de apresentação.

---

# 22. CRITÉRIOS DE ACEITE

O projeto só deve ser considerado concluído quando:

- O repositório existente tiver sido analisado.
- O código antigo tiver sido aproveitado.
- Existir um Microservice MongoDB independente.
- O MongoDB Atlas Free Tier estiver integrado.
- Existir CRUD completo no Microservice MongoDB.
- Existir Swagger do Microservice MongoDB.
- Existir um Microservice Azure SQL independente.
- O Azure SQL Database estiver integrado.
- Existir CRUD completo no Microservice Azure SQL.
- Existir Swagger do Microservice Azure SQL.
- Existir um BFF Node.js funcional.
- `GET /aggregated-data` consultar os dois microservices e a Azure Function.
- Existir uma Azure Function HTTP Trigger funcional.
- Existir um API Gateway real.
- Existir um Microfrontend React demonstrável.
- O frontend consumir somente o Gateway/BFF.
- Existir um fluxo Event-Driven Architecture real.
- Existirem testes unitários.
- Existirem testes de arquitetura.
- Os testes executados passarem.
- Os serviços tiverem Dockerfiles.
- As imagens estiverem preparadas para Docker Hub.
- Os cinco projetos estiverem preparados para GitHub.
- Existirem READMEs.
- Existir documentação Swagger/OpenAPI.
- Existir documentação dos eventos.
- Existir documentação ARC42 atualizada.
- Existirem diagramas C4.
- Existir Software Architecture Canvas.
- Existir roteiro de demonstração.
- Existirem instruções de deploy público.
- Nenhum recurso pago tiver sido contratado sem autorização.

Diferencie claramente:

- Implementado e testado.
- Implementado, mas ainda não publicado.
- Dependente de credenciais ou infraestrutura.
- Pendente de implementação.

Não declarar como concluídos serviços que ainda não foram testados.

---

# 23. INSTRUÇÕES DE EXECUÇÃO

Não entregue apenas explicações ou exemplos de código.

**Implemente efetivamente os arquivos necessários dentro do repositório.**

Trabalhe de forma incremental.

Depois de cada fase:

- Execute os testes relevantes.
- Corrija os problemas encontrados.
- Verifique regressões.
- Atualize o plano.
- Registre decisões arquiteturais.
- Documente pendências.

Não remover funcionalidades antigas sem necessidade.

Não realizar operações destrutivas em bancos existentes.

Não criar recursos pagos automaticamente.

Não inventar URLs, credenciais ou resultados de testes.

Se uma etapa exigir autenticação na Azure, MongoDB Atlas, Docker Hub ou GitHub, prepare tudo o que for possível e documente exatamente o que falta para concluir essa etapa.

Não interrompa a implementação inteira apenas porque uma credencial de nuvem está indisponível.

Continue implementando e testando localmente os demais componentes.

---

# 24. OBJETIVO FINAL

O resultado esperado é o **FuelWise funcionando como uma aplicação distribuída**, de acordo com o enunciado da Entrega 3.

A arquitetura deve conter:

**Microfrontend React → API Gateway → BFF Node.js → Microservices MongoDB e Azure SQL + Azure Function.**

Com:

- Clean Architecture.
- Vertical Slice.
- Event-Driven Architecture.
- Dois bancos distintos.
- CRUD completo.
- Swagger.
- Testes.
- Docker.
- Documentação.
- Deploy público demonstrável.

Prioridades:

1. Aproveitar o máximo possível do projeto existente.
2. Preservar funcionalidades e regras de negócio.
3. Cumprir os requisitos do professor.
4. Utilizar obrigatoriamente MongoDB Atlas e Azure SQL Database.
5. Implementar um fluxo completo de ponta a ponta.
6. Evitar qualquer contratação ou cobrança não autorizada.
7. Preparar a aplicação para demonstração em URLs públicas.
8. Documentar fielmente o que foi implementado.

**COMECE ANALISANDO TODO O REPOSITÓRIO ATUAL. IDENTIFIQUE O QUE JÁ EXISTE, GERE O PLANO E IMPLEMENTE AS ETAPAS NECESSÁRIAS. NÃO RECOMECE O FUELWISE DO ZERO.**