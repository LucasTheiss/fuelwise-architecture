import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import {aggregate} from './aggregate.js';
import {spec} from './openapi.js';
const route=fn=>(q,r,n)=>Promise.resolve(fn(q,r,n)).catch(n);
export function createApp(deps){
  const app=express();app.disable('x-powered-by');app.use(helmet());app.use(express.json({limit:'64kb'}));
  app.get('/health/live',(_q,r)=>r.json({status:'ok'}));app.get('/health/ready',(_q,r)=>r.json({status:'ready'}));
  app.get('/openapi.json',(_q,r)=>r.json(spec));app.use('/docs',swaggerUi.serve,swaggerUi.setup(spec));
  app.use((q,r,n)=>{const at=Date.now();r.on('finish',()=>console.log(JSON.stringify({service:'bff',method:q.method,path:q.path,status:r.statusCode,durationMs:Date.now()-at})));n();});
  const auth=route(async(q,_r,n)=>{if(!q.headers.authorization?.startsWith('Bearer '))throw Object.assign(Error('Autenticação necessária'),{status:401});q.account=(await deps.client(deps.legacyUrl+'/api/v1/auth/me',{bearer:q.headers.authorization})).account;n();});
  app.get('/aggregated-data',auth,route(async(q,r)=>{const result=await aggregate(q.headers.authorization,deps);r.status(result.degraded?207:200).json(result);}));
  for(const action of ['login','refresh','logout'])app.post('/api/v1/auth/'+action,route(async(q,r)=>r.json(await deps.client(deps.legacyUrl+'/api/v1/auth/'+action,{method:'POST',body:q.body}))));
  app.get('/api/v1/auth/me',auth,(q,r)=>r.json({account:q.account}));
  for(const [resource,url]of [['stations',deps.stationsUrl],['trips',deps.tripsUrl],['drivers',deps.legacyUrl],['vehicles',deps.legacyUrl]]){
    // Fixed resource allowlist and validated suffix avoid creating an open proxy.
    app.use('/api/v1/'+resource,auth,route(async(q,r,n)=>{
      if(!['GET','POST','PUT','PATCH','DELETE'].includes(q.method))return n();
      const suffix=q.path;
      if(!/^\/(?:[0-9a-f-]{36}(?:\/(?:prices|finish))?)?$/i.test(suffix))return n();
      const query=new URLSearchParams(q.query).toString();
      const data=await deps.client(url+'/api/v1/'+resource+(suffix==='/'?'':suffix)+(query?'?'+query:''),{method:q.method,bearer:q.headers.authorization,...(['POST','PUT','PATCH'].includes(q.method)?{body:q.body}:{})});
      r.status(q.method==='POST'?201:200).json(data);
    }));
  }
  app.use((_q,r)=>r.status(404).json({error:{code:'NOT_FOUND',message:'Rota não encontrada'}}));
  app.use((e,q,r,n)=>{if(r.headersSent)return n(e);const status=e.status||500;r.status(status).json({error:{code:String(status),message:status>=500?'Serviço indisponível':e.message}});});return app;
}
