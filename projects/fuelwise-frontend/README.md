# FuelWise Microfrontends

React + Vite. Shell controla login/menu/dashboard; módulos Postos e Viagens
exportam `contractVersion=1` e `mount(element,{api,account}) -> unmount`.
Cada módulo tem build próprio e inclui seu React, montado em raiz independente.
O shell carrega os ES modules por URL em runtime; não importa o código dos
módulos no build. Podem ser publicados separadamente (CORS para origem do shell).

`npm ci`; `npm run build`; `npm run preview -- --port 5173`; `npm test`.
Para desenvolver shell: primeiro build dos módulos, copiar módulos para servidor
estático ou configurar suas URLs; `npm run dev`. Build independente:
`npm run build:stations`, `npm run build:trips`, `npm run build:shell`.
Build:shell limpa dist, portanto executar antes dos remotos quando juntos.

Editar `public/runtime-config.js` antes do build ou `dist/runtime-config.js`
depois. Apenas gatewayUrl público e URLs dos módulos, sem segredos. Tokens
permanecem em memória, nunca localStorage. Nova sessão após recarregar/expirar.
ADMIN gerencia postos; MANAGER gerencia viagens; DRIVER consulta/finaliza suas
viagens. Cadastros de frota e contas permanecem nas APIs existentes.

Deploy: Azure Static Web Apps **Free**, publicar dist (ou três sites Free para
shell/remotos), configurar gateway HTTPS e CORS. Nenhuma URL pública provisionada.
Docker não é obrigatório para frontend estático. Não há Swagger do frontend;
contratos HTTP estão nos serviços/BFF. Testar CRUD com bancos reais antes do vídeo.

Integrantes: Artur Ribeiro de Souza; Cristhian Rezende; Lucas Andriani Theiss;
Vinicius da Rosa Padilha.
