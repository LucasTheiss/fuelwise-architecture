// Creates fictitious demo data through the public API, for recording the demo after the
// ephemeral legacy database resets. Usage:
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... GATEWAY_URL=https://gateway.<domain> LEGACY_URL=https://legacy.<domain> \
//   [DEMO_PASSWORD=...] node scripts/seed-demo.mjs
import {randomUUID,randomInt} from 'node:crypto';
const {ADMIN_EMAIL,ADMIN_PASSWORD,GATEWAY_URL:G,LEGACY_URL:L}=process.env;
if(!ADMIN_EMAIL||!ADMIN_PASSWORD||!G||!L)throw Error('Set ADMIN_EMAIL, ADMIN_PASSWORD, GATEWAY_URL and LEGACY_URL');
const password=process.env.DEMO_PASSWORD||'Fw!Demo-'+randomUUID().slice(0,8);
async function api(base,path,method='GET',body,token){
  const r=await fetch(base+path,{method,signal:AbortSignal.timeout(90000),headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const data=await r.json();if(!r.ok)throw Error(`${method} ${path}: ${r.status} ${JSON.stringify(data)}`);return data;
}
const cnpj=()=>{const c=Array.from({length:12},()=>randomInt(10));const d=w=>{const x=w.reduce((v,k,i)=>v+k*c[i],0)%11;return x<2?0:11-x;};c.push(d([5,4,3,2,9,8,7,6,5,4,3,2]));c.push(d([6,5,4,3,2,9,8,7,6,5,4,3,2]));return c.join('');};
const plate=()=>Array.from({length:3},()=>String.fromCharCode(65+randomInt(26))).join('')+randomInt(10)+'D'+String(randomInt(100)).padStart(2,'0');
const suffix=randomUUID().slice(0,4);
const admin=(await api(G,'/api/v1/auth/login','POST',{email:ADMIN_EMAIL,password:ADMIN_PASSWORD})).accessToken;
const email=`gerente.${suffix}@fuelwise.demo`;
const signup=await api(L,'/api/v1/carriers/requests','POST',{carrier:{name:'Transportadora Paraná '+suffix,legalName:'Paraná Logística Ltda',taxId:cnpj()},manager:{name:'Gerente Demo',email,password}});
await api(L,`/api/v1/admin/carriers/${signup.carrier.id}/decision`,'PATCH',{decision:'APPROVE'},admin);
const manager=(await api(G,'/api/v1/auth/login','POST',{email,password})).accessToken;
const {items:existing=[]}=await api(G,'/api/v1/stations','GET',null,admin).catch(()=>({}));
for(const [name,lat,lng,price] of [['Posto Rodovia BR-277',-25.48,-49.29,6.19],['Posto Centro Curitiba',-25.43,-49.27,6.29]]){
  if(existing.some(s=>s.name===name))continue;
  const {station}=await api(G,'/api/v1/stations','POST',{name,address:'Curitiba - PR',latitude:lat,longitude:lng,isAffiliated:true},admin);
  await api(G,`/api/v1/stations/${station.id}/prices`,'POST',{fuelType:'DIESEL_S10',pricePerLiter:price},admin);
}
for(const [name,slug] of [['João Motorista','joao'],['Maria Motorista','maria']]){
  await api(G,'/api/v1/drivers','POST',{name,email:`${slug}.${suffix}@fuelwise.demo`,password,driverLicense:String(randomInt(10000000000,99999999999))},manager);
  await api(G,'/api/v1/vehicles','POST',{plate:plate(),model:'Caminhão Volvo FH'},manager);
}
console.log(JSON.stringify({manager:{email,password},admin:{email:ADMIN_EMAIL},note:'Viagens: criar pelo frontend (login do gerente). Postos: CRUD pelo login do admin.'},null,2));
