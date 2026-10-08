import { route } from '../../../shared/http/register.js';
import { z } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/notifications/device',{status:201,
  body:z.object({token:z.string().min(20).max(4096)}).strict(),execute
},deps);
