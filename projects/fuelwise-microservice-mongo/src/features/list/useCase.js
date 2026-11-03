import { missing } from '../../domain/errors.js';
export async function execute(input,{repository}){return {items:await repository.list(input),page:input.page,limit:input.limit};}
