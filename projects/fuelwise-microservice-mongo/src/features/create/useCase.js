import { missing } from '../../domain/errors.js';
export async function execute(input,{repository}){return {station:await repository.create(input)};}
