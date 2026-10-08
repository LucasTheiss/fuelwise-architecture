import { route } from '../../../shared/http/register.js';
export const register=(app,deps)=>route(app,'get','/api/v1/auth/me',{execute:({actor})=>({account:{id:actor.id,name:actor.name,email:actor.email,role:actor.role,carrierId:actor.carrier_id}})},deps);
