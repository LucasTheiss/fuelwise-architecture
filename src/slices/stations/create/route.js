import { route } from '../../../shared/http/register.js';
import { z,name,lat,lon } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/stations',{roles:['ADMIN'],status:201,
  body:z.object({name,address:z.string().trim().min(5).max(300),latitude:lat,longitude:lon,isAffiliated:z.boolean().default(false)}).strict(),execute
},deps);
