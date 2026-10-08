import { route } from '../../../shared/http/register.js';
import { z } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/auth/refresh',{publicRoute:true,
  body:z.object({refreshToken:z.string().min(30)}).strict(),execute
},deps);
