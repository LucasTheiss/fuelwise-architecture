import { route } from '../../../shared/http/register.js';
import { z,paging,lat,lon } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/stations',{
  roles:['ADMIN','MANAGER','DRIVER'],
  query:paging.extend({isAffiliated:z.enum(['true','false']).optional(),latitude:lat.optional(),longitude:lon.optional(),radiusKm:z.coerce.number().positive().max(200).default(2)}).refine(v=>(v.latitude===undefined)===(v.longitude===undefined),{message:'Latitude e longitude devem ser informadas juntas'}),execute
},deps);
