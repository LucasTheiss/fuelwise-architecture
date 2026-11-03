import { missing } from '../../domain/errors.js';
export async function execute(input,{repository}){const station=await repository.deactivate(input);if(!station)throw missing();return {station};}
