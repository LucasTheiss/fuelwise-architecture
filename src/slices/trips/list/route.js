import { route } from '../../../shared/http/register.js';
import { z,paging } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/trips',{
  roles:['MANAGER','DRIVER'],query:paging.extend({status:z.enum(['IN_PROGRESS','FINISHED']).optional()}),execute
},deps);
