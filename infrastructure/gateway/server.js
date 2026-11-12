import {readFileSync} from 'node:fs';import {createServer} from 'node:https';import {createGateway} from './app.js';
const app=createGateway({bffUrl:process.env.BFF_URL,origins:(process.env.CORS_ORIGIN||'').split(',').filter(Boolean)});
// Behind a managed ingress (Azure Container Apps = 1 hop), rate limits must key on the real client IP.
if(process.env.TRUST_PROXY_HOPS)app.set('trust proxy',Number(process.env.TRUST_PROXY_HOPS));
const tls=process.env.TLS_CERT_FILE&&process.env.TLS_KEY_FILE;
if(process.env.NODE_ENV==='production'&&!tls&&process.env.TLS_TERMINATED_UPSTREAM!=='true')throw Error('HTTPS obrigatório: configurar certificado ou proxy TLS confiável');
const server=tls?createServer({cert:readFileSync(process.env.TLS_CERT_FILE),key:readFileSync(process.env.TLS_KEY_FILE)},app):app;
server.listen(Number(process.env.PORT||8080));
