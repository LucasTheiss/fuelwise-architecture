import { route } from '../../../shared/http/register.js';
import { z,uuid } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/trips',{roles:['MANAGER'],status:201,
  body:z.object({driverId:uuid,vehicleId:uuid}).strict(),execute
},deps);
