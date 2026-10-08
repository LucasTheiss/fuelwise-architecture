import { route } from '../../../shared/http/register.js';
import { paging,z } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/fuelings',{roles:['MANAGER','DRIVER'],
  query:paging.extend({status:z.enum(['AWAITING_APPROVAL','APPROVED','REJECTED','PAID','PAYMENT_REJECTED','PAYMENT_UNKNOWN']).optional()}),execute
},deps);
