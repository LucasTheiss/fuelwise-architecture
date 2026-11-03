import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import {asyncRoute,errors,roles} from './api/http.js';
import {spec} from './api/openapi.js';
import {requireRepository} from './application/ports.js';
import {register as create} from './features/create/route.js';
import {register as list} from './features/list/route.js';
import {register as get} from './features/get/route.js';
import {register as update} from './features/update/route.js';
import {register as remove} from './features/delete/route.js';
import {register as finish} from './features/finish/route.js';
export function createApp({repository,authenticate,fleet}){requireRepository(repository);const app=express();app.disable('x-powered-by');app.use(helmet());app.use(express.json({limit:'64kb'}));app.use((q,r,n)=>{const at=Date.now();r.on('finish',()=>console.log(JSON.stringify({service:'trips',path:q.path,method:q.method,status:r.statusCode,durationMs:Date.now()-at})));n();});
app.get('/health/live',(_q,r)=>r.json({status:'ok'}));app.get('/health/ready',asyncRoute(async(_q,r)=>{await repository.ready();r.json({status:'ready'});}));app.get('/openapi.json',(_q,r)=>r.json(spec));app.use('/docs',swaggerUi.serve,swaggerUi.setup(spec));
app.use('/api',asyncRoute(async(q,_r,n)=>{q.actor=await authenticate(q.headers.authorization);n();}));
app.get('/api/v1/events',roles('MANAGER'),asyncRoute(async(q,r)=>r.json({items:await repository.audit(q.actor)})));
[create,list,get,update,remove,finish].forEach(register=>register(app,{repository,fleet}));app.use((_q,r)=>r.status(404).json({error:{code:'NOT_FOUND'}}));app.use(errors);return app;}
