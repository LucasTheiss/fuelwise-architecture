import { missing } from '../../domain/errors.js';
export async function execute(input,{repository}){const station=await repository.update(input.id,input.data);if(!station)throw missing();return {station};}
