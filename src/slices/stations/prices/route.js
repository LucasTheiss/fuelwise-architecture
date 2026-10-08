import { route } from '../../../shared/http/register.js';
import { z,uuid,paging,fuelType } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/stations/:id/prices',{
  roles:['ADMIN','MANAGER','DRIVER'],params:z.object({id:uuid}),
  query:paging.extend({type:fuelType.optional()}),execute
},deps);
