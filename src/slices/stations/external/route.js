import { route } from '../../../shared/http/register.js';
export const register=(app,deps)=>route(app,'get','/api/v1/stations/external',{
  roles:['ADMIN','MANAGER','DRIVER'],execute:async (_context,deps)=>({items:await deps.stations.list(),origin:deps.stations.simulated ? 'MOCK' : 'EXTERNAL_PROVIDER',simulated:Boolean(deps.stations.simulated)})
},deps);
