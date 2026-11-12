# Roteiro 2 — Falas para dublagem

**Para quê:** cada integrante grava a própria fala por cima do vídeo de tela
(`roteiro-tela.md`). As seções **S1–S5** e os tempos batem com a gravação. O
enunciado exige que **todos falem e isso fique explícito**, por isso cada um
começa dizendo o nome. Ritmo de cerca de 140 palavras por minuto. O texto entre
colchetes indica o momento da tela.

---

## S1 · 0:00–1:45 · Artur Ribeiro de Souza

"Olá, eu sou o **Artur Ribeiro de Souza**. Este é o FuelWise, um sistema de
gestão de frota e combustível para transportadoras. [1.1] Na Entrega 3, a
aplicação virou uma arquitetura distribuída: um microfrontend em React, um API
Gateway, um BFF em Node.js, dois microservices, uma Azure Function e eventos.
[1.2] Tudo roda na Azure, em Container Apps, com o MongoDB Atlas e o Azure SQL
Database como bancos. [1.3] Este é o frontend publicado na internet, não em
localhost. [1.5] No Network, vemos os dois microfrontends, Postos e Viagens,
carregados em tempo de execução. Repare que todas as chamadas vão para o
gateway: o frontend nunca acessa os microservices diretamente. O gateway
centraliza a entrada, aplica CORS e limite de requisições, e repassa ao BFF."

## S2 · 1:45–4:00 · Cristhian Rezende

"Eu sou o **Cristhian Rezende** e vou mostrar o microservice de Postos, que usa
o MongoDB Atlas. [2.1] Entro como administrador. [2.2] Cadastro um posto novo:
a requisição sai do frontend, passa pelo gateway e pelo BFF e chega ao
microservice, que grava no Atlas. [2.3] Agora edito o nome. [2.4] Pelo Swagger
do BFF, registro o preço do diesel S10 para esse posto, e a resposta é 201.
[2.5] A consulta mostra o histórico de preços. [2.6] No Atlas, o documento está
gravado com o nome editado. [2.7] Por fim, desativo o posto: é uma exclusão
lógica, então o registro sai da lista mas o histórico é preservado. [2.8] Este é
o Swagger do microservice de Postos, com o CRUD completo documentado."

## S3 · 4:00–6:30 · Lucas Andriani Theiss

"Eu sou o **Lucas Andriani Theiss** e vou apresentar o microservice de Viagens,
que usa o Azure SQL Database. [3.1] Agora entro como gerente da transportadora.
[3.2] Crio uma viagem escolhendo motorista e veículo. Ela começa em andamento.
[3.3] Edito a observação. [3.4] Aqui está a regra de negócio: um motorista ou
veículo não pode ter duas viagens em andamento. Ao tentar de novo com o mesmo
motorista, o sistema recusa com conflito 409, garantido por um índice único no
banco, mesmo com requisições simultâneas. [3.5] Finalizo a viagem. [3.6] Só
viagens finalizadas podem ser desativadas, e também é exclusão lógica. [3.7]
Deixo outra viagem em andamento para o painel. [3.8] No Azure SQL, vemos as
viagens com seus estados. [3.9] E este é o Swagger do microservice de Viagens."

## S4 · 6:30–9:00 · Vinicius da Rosa Padilha

"Eu sou o **Vinicius da Rosa Padilha** e vou mostrar o BFF, a Azure Function e
os eventos. [4.1] O painel mostra os indicadores da operação. [4.2] Eles vêm do
endpoint obrigatório `GET /aggregated-data` do BFF. Numa única chamada, o BFF
consulta o microservice do MongoDB, o microservice do Azure SQL e a Azure
Function, e devolve tudo em um único JSON. `degraded: false` indica que as três
fontes responderam. [4.3] No log do BFF aparece a chamada. [4.4] E no log da
Azure Function, a execução do cálculo de indicadores. [4.5] Agora os eventos:
cada alteração de viagem gera um evento: criada, atualizada, finalizada e
desativada. [4.6] Eles são gravados numa tabela outbox na mesma transação da
viagem e publicados por um worker: `delivered_at` mostra a entrega. [4.7] O
consumidor registra a auditoria, sem duplicar, porque cada evento tem um
identificador único. [4.8] No log, o consumo de cada evento."

## S5 · 9:00–10:00 · Todos (uma frase cada, nesta ordem)

- **Artur:** "O código segue Clean Architecture, com as camadas domain,
  application, infrastructure e API."
- **Cristhian:** "E Vertical Slice: cada funcionalidade, como create ou list,
  fica na sua própria pasta, com testes unitários e de arquitetura."
- **Lucas:** "Os cinco projetos estão em repositórios públicos no GitHub e as
  imagens estão publicadas no Docker Hub."
- **Vinicius:** "A documentação ARC42, o C4 e o Canvas estão no PDF da entrega.
  Obrigado!"

---

**Conferência antes de publicar:** os quatro falaram e disseram o nome · cada
fala cai na seção certa da tela · nenhuma senha ou token aparece · publicar
como **não listado** e colar o link em `docs/PUBLIC_URLS.md` e no ARC42/PDF.
