import { route } from '../../../shared/http/register.js';
import { paging,z } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/complaints',{
  roles:['ADMIN','MANAGER','DRIVER'],query:paging.extend({status:z.enum(['OPEN','UNDER_REVIEW','RESOLVED','REJECTED']).optional()}),execute
},deps);
