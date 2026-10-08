import { route } from '../../../shared/http/register.js';
import { z,uuid } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/vehicles/:id/location',{
  params:z.object({id:uuid}),roles:['MANAGER','DRIVER','ADMIN'],execute
},deps);
