import {readFileSync} from 'node:fs';import {createServer} from 'node:https';import {createGateway} from './app.js';
const app=createGateway({bffUrl:process.env.BFF_URL,origins:(process.env.CORS_ORIGIN||'').split(',').filter(Boolean)});
const tls=process.env.TLS_CERT_FILE&&process.env.TLS_KEY_FILE;
if(process.env.NODE_ENV==='production'&&!tls&&process.env.TLS_TERMINATED_UPSTREAM!=='true')throw Error('HTTPS obrigatório: configurar certificado ou proxy TLS confiável');
const server=tls?createServer({cert:readFileSync(process.env.TLS_CERT_FILE),key:readFileSync(process.env.TLS_KEY_FILE)},app):app;
server.listen(Number(process.env.PORT||8080));
