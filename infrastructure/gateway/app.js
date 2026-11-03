import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {rateLimit} from 'express-rate-limit';
export function createGateway({bffUrl,origins,limit=120,fetcher=fetch}){
  if(!bffUrl||!origins?.length||origins.includes('*'))throw Error('BFF_URL e CORS_ORIGIN explícitos são obrigatórios');
  const app=express();app.disable('x-powered-by');app.use(helmet());
  app.use((q,r,n)=>{const origin=q.headers.origin;if(origin&&!origins.includes(origin))return r.status(403).json({error:{code:'ORIGIN_DENIED'}});n();});
  app.use(cors({origin:origins,methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Authorization']}));
  app.get('/health/live',(_q,r)=>r.json({status:'ok'}));
  app.use(rateLimit({windowMs:60000,limit,standardHeaders:'draft-7',legacyHeaders:false}));
  app.use('/api/v1/auth',rateLimit({windowMs:900000,limit:20,standardHeaders:'draft-7',legacyHeaders:false}));
  app.use(express.raw({type:()=>true,limit:'64kb'}));
  app.use(async(q,r)=>{
    if(!/^\/(?:api\/v1\/|aggregated-data(?:\?|$)|docs(?:\/|\?|$)|openapi.json(?:\?|$))/.test(q.originalUrl))return r.status(404).json({error:{code:'NOT_FOUND'}});
    try{const response=await fetcher(bffUrl+q.originalUrl,{method:q.method,redirect:'manual',signal:AbortSignal.timeout(12000),headers:{...(q.headers.authorization?{authorization:q.headers.authorization}:{}),...(q.headers['content-type']?{'content-type':q.headers['content-type']}:{}),'x-request-id':crypto.randomUUID()},...(['GET','HEAD'].includes(q.method)||!q.body?.length?{}:{body:q.body})});
      for(const header of ['content-type','location','retry-after'])if(response.headers.has(header))r.setHeader(header,response.headers.get(header));
      r.status(response.status).send(Buffer.from(await response.arrayBuffer()));
    }catch{r.status(503).json({error:{code:'UPSTREAM_UNAVAILABLE',message:'BFF indisponível'}});}
  });return app;
}
