import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { asyncRoute,errors } from './api/http.js';
import { requireRepository } from './application/ports.js';
import { register as create } from './features/create/route.js';
import { register as list } from './features/list/route.js';
import { register as get } from './features/get/route.js';
import { register as update } from './features/update/route.js';
import { register as remove } from './features/delete/route.js';
import { register as prices } from './features/prices/route.js';
import { spec } from './api/openapi.js';
export function createApp({repository,authenticate}) {
  const deps={repository:requireRepository(repository)};
  const app=express();app.disable('x-powered-by');app.use(helmet());app.use(express.json({limit:'64kb'}));
  app.use((req,res,next)=>{const at=Date.now();res.on('finish',()=>console.log(JSON.stringify({service:'stations',method:req.method,path:req.path,status:res.statusCode,durationMs:Date.now()-at})));next();});
  app.get('/health/live',(_q,r)=>r.json({status:'ok'}));
  app.get('/health/ready',asyncRoute(async(_q,r)=>{await repository.ready();r.json({status:'ready'});}));
  app.get('/openapi.json',(_q,r)=>r.json(spec));app.use('/docs',swaggerUi.serve,swaggerUi.setup(spec));
  app.use('/api',asyncRoute(async(req,_res,next)=>{req.actor=await authenticate(req.headers.authorization);next();}));
  [create,list,get,update,remove,prices].forEach(register=>register(app,deps));
  app.use((_q,r)=>r.status(404).json({error:{code:'NOT_FOUND',message:'Rota não encontrada'}}));app.use(errors);return app;
}
