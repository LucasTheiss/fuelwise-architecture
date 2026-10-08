import { route } from '../../../shared/http/register.js';
import { z,name,email,password } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'post','/api/v1/drivers',{
  roles:['MANAGER'],status:201,body:z.object({name,email,password,driverLicense:z.string().regex(/^\d{11}$/)}).strict(),execute
},deps);
