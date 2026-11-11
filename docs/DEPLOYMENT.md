# Execução e publicação da Entrega 3

## Local, preservando o ambiente original

O `compose.yaml` original continua executando todos os fluxos legados.
`compose.delivery.yaml` usa projeto/volumes próprios, sem remover dados antigos.
Não executar `down -v` em um ambiente com dados que se deseja preservar.

```powershell
Copy-Item .env.delivery.example .env.delivery
# Preencher senhas fortes e JWT_SECRET, sem versionar .env.delivery.
docker compose --env-file .env.delivery -f compose.delivery.yaml up -d --build
node scripts/smoke-delivery.mjs
```

Frontend: http://localhost:5173; gateway: http://localhost:18080;
Swagger BFF: http://localhost:18080/docs; legado: http://localhost:3000.
Swagger dos serviços é acessível na rede Docker em stations:3001/docs e
trips:3002/docs. Para inspeção local, encaminhar uma porta loopback explicitamente.
Os bancos não expõem portas no host. Health checks dos serviços verificam seus
bancos. O Compose padrão usa o adaptador Function Node; o overlay abaixo executa
o host oficial. A apresentação final continua exigindo Azure Functions público.

### Host oficial da Function, sem recursos Azure

```powershell
node scripts/prepare-function-runtime.mjs
docker compose --env-file .env.delivery --env-file .env.function-runtime -f compose.delivery.yaml -f compose.functions-runtime.yaml up -d --build
node scripts/test-function-runtime.mjs
node scripts/smoke-delivery.mjs
```

O overlay usa a imagem oficial `mcr.microsoft.com/azure-functions/node:4-node22`
e Azurite como armazenamento emulado local. A porta 7071 aceita somente loopback;
o BFF envia a chave em header. O teste verifica autenticação do host, resultados
e entradas inválidas. Os arquivos `.env.function-runtime` e `tmp/function-secrets/`
são ignorados. Gerar novas chaves exige recriar Function/BFF/Azurite com Compose.
Não publicar esse overlay: suas configurações são exclusivas de desenvolvimento.
Core Tools continua disponível como alternativa via `npm start` no projeto da
Function. Este teste local não comprova gratuidade nem implantação na Azure.

Para inspecionar os Swagger, adicionar `-f compose.inspect.yaml` ao comando
Compose: http://localhost:13001/docs e http://localhost:13002/docs. Apenas portas
loopback dos serviços são abertas; o frontend continua usando o gateway.
Ao parar a variante oficial, usar os mesmos `--env-file` e `-f` com `down`, sem `-v`.

Referência da imagem: [Microsoft - containers Functions](https://learn.microsoft.com/en-us/azure/azure-functions/container-concepts).

O teste smoke cria uma transportadora fictícia aprovada, gerente, motorista,
veículo, posto/preço e viagem. Verifica CRUD, conflito de viagem ativa, agregação
e consumo de evento. Não contém credenciais fixas. Pode ser executado novamente
com dados novos. Uma sessão de teste é salva em `tmp/`, ignorada pelo Git.

Parar sem apagar volumes:
`docker compose --env-file .env.delivery -f compose.delivery.yaml down`.

## Limite da migração

DOMAIN_MODE=distributed intercepta as rotas de postos/viagens do legado e as
encaminha aos novos donos. A inicialização recusa esse modo se houver postos ou
viagens no PostgreSQL: **não migra nem apaga dados automaticamente**.
O modo original continua íntegro. O financeiro antigo permanece disponível no
modo original; referências financeiras para viagens novas distribuídas ainda não
foram migradas. O fluxo de aceite desta entrega cobre postos, viagens, indicadores
e eventos. Não anunciar pagamento distribuído como concluído.

Antes de migrar uma instalação com dados reais: exportar com IDs preservados,
conciliar viagens em andamento/abastecimentos, desenhar a ponte financeira com
controle de concorrência, congelar os escritores antigos e testar recuperação.
O bloqueio atual evita duas fontes mutáveis de verdade por acidente.

## Cloud — estado e gates antes de publicar

Os cinco repositórios e as três imagens v1 já estão públicos. Os serviços ainda
não têm URLs de execução HTTPS. Confira `docs/PUBLIC_URLS.md` e
`docs/CLOUD_COSTS.md` antes de escolher infraestrutura.

1. Não criar planos que consumam créditos Azure, cobrem Storage/logs/rede, ou
   tenham excedente pago sem autorização. Para `fuelwiseDB`, preservar Free,
   AutoPause e overage desativado.
2. O frontend estático pode ser avaliado no Azure Static Web Apps Free. A Function
   gerenciada desse produto tem runtime limitado; o projeto atual exige Node 22,
   então a compatibilidade precisa ser resolvida antes de publicar a API.
3. Azure Functions Consumption possui franquia de execuções em condições
   específicas, mas Storage e rede têm cobrança separada. Não criar Function App
   ou Storage sem comprovar custo total zero para esta assinatura.
4. A API legada ainda depende de PostgreSQL para login, usuários e outros slices.
   Os serviços novos consultam identidade/frota do legado por HTTP. Não existe
   endpoint público funcional sem hospedar essa dependência; não tratar o SQL de
   Viagens como substituto automático do PostgreSQL.
5. Antes de hospedar BFF, gateway e microservices, comprovar plano gratuito,
   disponibilidade, egress restrito, TLS, logs e conectividade com Atlas/Azure
   SQL. Não abrir a firewall SQL para todas as origens.
6. Quando houver uma topologia aprovada, publicar com secrets do provedor, apontar
   as variáveis HTTPS e executar o smoke test somente com dados fictícios.
7. Salvar prints cloud reais em `docs/evidence/cloud/`, atualizar links e
   regenerar ARC42/PDF após validar cada URL.

## Docker Hub e cinco repositórios

Somente após autorização, executar `docker login` interativamente; nunca fornecer
token na linha de comando ou arquivo versionado. `scripts/docker-images.ps1
-DockerHubUser USUARIO` faz builds; `-Push` publica explicitamente.

`scripts/export-projects.ps1` exporta apenas arquivos rastreados dos cinco
projetos, sem node_modules, segredos ou artefatos temporários. Para preservar
histórico, alternativa revisável: `git subtree split --prefix=projects/NOME -b
export-NOME` e push para repositório autorizado. Não executado automaticamente.
O gateway permanece na infraestrutura do repositório original.

## Validação

`npm ci` em cada diretório; `node scripts/validate-all.mjs`; `npm run check`;
`npm run build` no frontend; Compose e smoke. Integrações cloud são um gate
separado e não podem ser substituídas pelos testes isolados.
