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
bancos. O adaptador Function local é identificado no Dockerfile; usar Core Tools
para validar o runtime e Azure Functions no vídeo final.

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

## Cloud, somente após revisão de CLOUD_COSTS.md

1. Obter Atlas Free e Azure SQL gratuito elegível. Configurar credenciais com
   privilégio mínimo, IPs de saída e TLS. Executar migrations SQL aditivas.
2. Publicar os serviços a partir de seus diretórios independentes (Dockerfile ou
   `npm ci`/`npm start`). Injetar variáveis dos `.env.example` em secret settings.
3. Hospedar identidade legada com PostgreSQL próprio. Não trocar o banco de
   viagens por este PostgreSQL. Usar ambiente de demonstração isolado.
4. Publicar Function em recurso previamente aprovado: `func azure functionapp
   publish NOME_APROVADO`; configurar FUNCTION_URL HTTPS e FUNCTION_KEY no BFF.
5. Publicar gateway com terminador TLS confiável, configurar BFF_URL e CORS_ORIGIN.
   Não divulgar as portas internas nem configurar CORS `*`.
6. Publicar `dist` frontend em Static Web Apps Free; editar runtime-config.js com
   URLs reais HTTPS. Remotos separados exigem CORS da hospedagem estática.
7. Aquecer serviços Free antes da demonstração para lidar com cold start. Não
   usar pings permanentes que consomem horas/franquias. Parar worker após sessão.
8. Executar smoke contra URLs reais, comprovar Atlas/Azure e coletar evidências.

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
