/** Migration boundary: enabled only for a separate, empty-domain deployment.
 * Existing monolith installations keep their original routes by default. */
export function mountExtractedDomains(app){
  if(process.env.DOMAIN_MODE!=='distributed')return;
  for(const [domain,base]of [['stations',process.env.STATIONS_SERVICE_URL],['trips',process.env.TRIPS_SERVICE_URL]]){
    if(!base)throw Error(`${domain} service URL required in distributed mode`);
    app.use('/api/v1/'+domain,async(req,res,next)=>{
      try{const suffix=req.originalUrl;const response=await fetch(base+suffix,{method:req.method,redirect:'error',signal:AbortSignal.timeout(10000),headers:{'content-type':'application/json',...(req.headers.authorization?{authorization:req.headers.authorization}:{})},...(['GET','HEAD'].includes(req.method)?{}:{body:JSON.stringify(req.body)})});res.status(response.status).json(await response.json());}catch{next(Object.assign(Error('Serviço extraído indisponível'),{status:503,code:'SERVICE_UNAVAILABLE'}));}
    });
  }
}
