import { z } from 'zod';
export const uuid = z.string().uuid();
export const paging = z.object({page:z.coerce.number().int().min(1).default(1),limit:z.coerce.number().int().min(1).max(100).default(20)});
export const station = z.object({name:z.string().trim().min(2).max(150),address:z.string().trim().min(5).max(300),latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180),isAffiliated:z.boolean().default(false)}).strict();
export const price = z.object({fuelType:z.enum(['DIESEL_S10','DIESEL_S500','GASOLINE','ETHANOL','ARLA32']),pricePerLiter:z.number().positive().max(99999).refine(v=>Math.abs(v*1000-Math.round(v*1000))<1e-7)}).strict();
export const listing = paging.extend({isAffiliated:z.enum(['true','false']).optional(),latitude:z.coerce.number().min(-90).max(90).optional(),longitude:z.coerce.number().min(-180).max(180).optional(),radiusKm:z.coerce.number().positive().max(200).default(2)}).refine(v=>(v.latitude===undefined)===(v.longitude===undefined));
export const asyncRoute = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export const roles = (...allowed)=>(req,res,next)=>allowed.includes(req.actor.role)?next():res.status(403).json({error:{code:'FORBIDDEN',message:'Acesso negado'}});
export function errors(err,req,res,next) {
  if(res.headersSent) return next(err);
  const status=err instanceof z.ZodError?400:err.kind==='not_found'?404:err.kind==='conflict'?409:err.status||500;
  res.status(status).json({error:{code:status===500?'INTERNAL_ERROR':String(status),message:status>=500?'Serviço indisponível':err instanceof z.ZodError?'Campos inválidos':err.message}});
}
