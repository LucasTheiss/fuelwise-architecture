import { route } from '../../../shared/http/register.js';
import { z,email } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register = (app,deps) => route(app,'post','/api/v1/auth/login',{
  publicRoute:true,body:z.object({email,password:z.string().min(1)}).strict(),execute
},deps);
