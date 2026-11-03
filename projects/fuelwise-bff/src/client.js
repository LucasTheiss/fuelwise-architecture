export function httpClient({timeoutMs=5000,fetcher=fetch}={}) {
  return async(url,{method='GET',bearer,body,key}={})=>{
    let r;try{r=await fetcher(url,{method,signal:AbortSignal.timeout(timeoutMs),redirect:'error',headers:{accept:'application/json',...(bearer?{authorization:bearer}:{}),...(body!==undefined?{'content-type':'application/json'}:{}),...(key?{'x-functions-key':key}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});}
    catch{throw Object.assign(Error('Serviço indisponível ou timeout'),{status:503});}
    let data;try{data=await r.json();}catch{throw Object.assign(Error('Resposta inválida do serviço'),{status:502});}
    if(!r.ok)throw Object.assign(Error(data?.error?.message||'Requisição recusada'),{status:r.status});return data;
  };
}
