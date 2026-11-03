export function createApi(gatewayUrl,getToken){
  if(!/^https?:\/\//.test(gatewayUrl))throw Error('Gateway não configurado');
  return async(path,method='GET',body)=>{const token=getToken();const r=await fetch(gatewayUrl+path,{method,signal:AbortSignal.timeout(15000),headers:{...(token?{authorization:`Bearer ${token}`}:{}) ,...(body!==undefined?{'content-type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!r.ok)throw Error(data.error?.message||'Falha na operação');return data;};
}
