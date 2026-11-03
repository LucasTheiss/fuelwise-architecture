export async function aggregate(bearer,{client,stationsUrl,tripsUrl,functionUrl,functionKey}){
  const results=await Promise.allSettled([client(stationsUrl+'/api/v1/stations?limit=100',{bearer}),client(tripsUrl+'/api/v1/trips?limit=100',{bearer})]);
  // Identity failures must never be converted into a successful empty dashboard.
  for(const r of results)if(r.status==='rejected'&&[401,403].includes(r.reason.status))throw r.reason;
  const errors={};const values=results.map((r,i)=>{if(r.status==='fulfilled')return r.value.items;errors[i===0?'stations':'trips']='Serviço indisponível';return null;});
  let analytics=null;
  try{analytics=await client(functionUrl,{method:'POST',key:functionKey,body:{stations:values[0],trips:values[1]}});}catch{errors.analytics='Indicadores indisponíveis';}
  return {stations:values[0],trips:values[1],analytics,degraded:Object.keys(errors).length>0,errors,scope:'Primeiros 100 registros visíveis por serviço; indicadores desta amostra'};
}
