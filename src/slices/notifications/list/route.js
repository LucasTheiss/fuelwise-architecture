import { route } from '../../../shared/http/register.js';
import { paging } from '../../../shared/http/validate.js';
import { execute } from './useCase.js';
export const register=(app,deps)=>route(app,'get','/api/v1/notifications',{query:paging,execute},deps);
