import {z} from 'zod';
export const uuid=z.string().uuid();
export const paging=z.object({page:z.coerce.number().int().min(1).default(1),limit:z.coerce.number().int().min(1).max(100).default(20),status:z.enum(['IN_PROGRESS','FINISHED']).optional()});
export const createSchema=z.object({driverId:uuid,vehicleId:uuid,notes:z.string().max(500).default('')}).strict();
export const updateSchema=z.object({notes:z.string().max(500)}).strict();
export const asyncRoute=fn=>(q,r,n)=>Promise.resolve(fn(q,r,n)).catch(n);
export const roles=(...allowed)=>(q,r,n)=>allowed.includes(q.actor.role)?n():r.status(403).json({error:{code:'FORBIDDEN',message:'Acesso negado'}});
export function errors(e,q,r,n){if(r.headersSent)return n(e);const status=e instanceof z.ZodError?400:e.kind==='not_found'?404:e.kind==='conflict'||[2601,2627].includes(e.number)?409:e.status||500;r.status(status).json({error:{code:String(status),message:status>=500?'Serviço indisponível':e instanceof z.ZodError?'Campos inválidos':e.message}});}
