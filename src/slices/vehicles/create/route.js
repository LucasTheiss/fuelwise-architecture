import { route } from '../../../shared/http/register.js';
import { z,name } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/vehicles',{roles:['MANAGER'],status:201,
  body:z.object({plate:z.string().trim().toUpperCase().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/),model:name}).strict(),execute
},deps);
