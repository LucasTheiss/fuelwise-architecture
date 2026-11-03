import {route} from '../../../shared/http/register.js';
import {z,uuid} from '../../../shared/http/validate.js';
import {execute} from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/migration/assignment',{roles:['MANAGER'],query:z.object({driverId:uuid,vehicleId:uuid}),execute},deps);
