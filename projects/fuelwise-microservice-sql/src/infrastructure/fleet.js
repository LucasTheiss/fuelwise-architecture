export function fleet(baseUrl){
  async function call(path,bearer){let r;try{r=await fetch(baseUrl+path,{headers:{authorization:bearer},signal:AbortSignal.timeout(5000)});}catch{throw Object.assign(Error('Legado indisponível'),{status:503});}if(!r.ok)throw Object.assign(Error('Consulta ao legado recusada'),{status:r.status>=500?503:r.status});return r.json();}
  return {
    async validateAssignment(actor,body,bearer){const result=await call(`/api/v1/migration/assignment?driverId=${body.driverId}&vehicleId=${body.vehicleId}`,bearer);if(!result.valid)throw Object.assign(Error('Motorista e veículo devem pertencer à transportadora'),{status:400});},
    async hasPending(actor,id,bearer){return(await call(`/api/v1/migration/trips/${id}/pending`,bearer)).pending;}
  };
}
