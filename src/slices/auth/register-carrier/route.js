import { route } from '../../../shared/http/register.js';
import { z, name, email, password } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const schema = z.object({
  carrier:z.object({name,legalName:name,taxId:z.string().transform(v=>v.replace(/\D/g,''))}),
  manager:z.object({name,email,password})
}).strict();
export const register = (app,deps) => route(app,'post','/api/v1/carriers/requests',{
  publicRoute:true,body:schema,status:201,execute
},deps);
