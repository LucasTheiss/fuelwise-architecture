import {writeFile} from 'node:fs/promises';
import {spec as mongo} from '../projects/fuelwise-microservice-mongo/src/api/openapi.js';
import {spec as sql} from '../projects/fuelwise-microservice-sql/src/api/openapi.js';
import {spec as bff} from '../projects/fuelwise-bff/src/openapi.js';
const id={type:'string',format:'uuid'},str={type:'string'};
const error={type:'object',required:['error'],properties:{error:{type:'object',required:['code','message'],properties:{code:str,message:str}}}};
const station={type:'object',required:['id','name','address','latitude','longitude','is_active'],properties:{id,name:str,address:str,latitude:{type:'number'},longitude:{type:'number'},is_affiliated:{type:'boolean'},is_active:{type:'boolean'},created_at:{type:'string',format:'date-time'}}};
const trip={type:'object',required:['id','carrier_id','driver_id','vehicle_id','status'],properties:{id,carrier_id:id,driver_id:id,vehicle_id:id,status:{type:'string',enum:['IN_PROGRESS','FINISHED']},notes:str,started_at:{type:'string',format:'date-time'},ended_at:{type:'string',format:'date-time',nullable:true},is_active:{type:'boolean'},version:{type:'integer'}}};
const price={type:'object',properties:{id,station_id:id,fuel_type:str,price_per_liter:{type:'string',example:'6.199'},effective_from:{type:'string',format:'date-time'}}};
const content=schema=>({'application/json':{schema}});
for(const [spec,entity,name]of [[mongo,station,'station'],[sql,trip,'trip']]){
  spec.components.schemas={...spec.components.schemas,Error:error,[name]:entity};
  for(const [path,methods]of Object.entries(spec.paths))for(const [method,op]of Object.entries(methods)){
    for(const code of [400,401,403,404,409,503])op.responses[code]={description:({400:'Validação inválida',401:'Não autenticado',403:'Perfil sem permissão',404:'Recurso não encontrado',409:'Conflito de estado ou exclusividade',503:'Dependência indisponível'})[code],content:content(error)};
    const list=method==='get'&&!path.includes('{id}');
    const schema=list?{type:'object',properties:{items:{type:'array',items:entity},page:{type:'integer'},limit:{type:'integer'}}}:path.endsWith('/prices')?(method==='get'?{type:'object',properties:{items:{type:'array',items:price},page:{type:'integer'},limit:{type:'integer'}}}:{type:'object',properties:{price}}):{type:'object',properties:{[name]:entity,...(name==='station'&&method==='get'?{currentPrices:{type:'array',items:price}}:{})}};
    op.responses[method==='post'?201:200]={description:'Sucesso',content:content(schema)};
    if(list||path.endsWith('/prices')&&method==='get'){op.parameters??=[];for(const param of [{name:'page',in:'query',schema:{type:'integer',minimum:1,default:1}},{name:'limit',in:'query',schema:{type:'integer',minimum:1,maximum:100,default:20}}])if(!op.parameters.some(x=>x.name===param.name))op.parameters.push(param);}
  }
}
mongo.paths['/api/v1/stations'].get.parameters.push(...['isAffiliated','latitude','longitude','radiusKm'].filter(n=>!mongo.paths['/api/v1/stations'].get.parameters.some(p=>p.name===n)).map(name=>({name,in:'query',schema:name==='isAffiliated'?{type:'string',enum:['true','false']}:{type:'number'}})));
sql.paths['/api/v1/events']={get:{summary:'Auditoria de eventos da transportadora (MANAGER)',responses:{200:{description:'Eventos processados',content:content({type:'object',properties:{items:{type:'array',items:{type:'object',properties:{event_id:id,trip_id:id,type:str,processed_at:{type:'string',format:'date-time'}}}}}})},401:{description:'Não autenticado'},403:{description:'Somente MANAGER'}}}};
bff.paths={...bff.paths,...mongo.paths,...sql.paths};bff.components.schemas={...mongo.components.schemas,...sql.components.schemas};
for(const action of ['login','refresh','logout'])bff.paths['/api/v1/auth/'+action]={post:{security:[],summary:action,requestBody:{required:true,content:content({type:'object',required:action==='login'?['email','password']:['refreshToken'],properties:action==='login'?{email:{type:'string',format:'email'},password:str}:{refreshToken:str}})},responses:{200:{description:'Contrato de sessão legado',content:content({type:'object'})},401:{description:'Não autenticado'}}}};
bff.paths['/api/v1/auth/me']={get:{responses:{200:{description:'Identidade ativa',content:content({type:'object',properties:{account:{type:'object',properties:{id,name:str,role:{type:'string',enum:['ADMIN','MANAGER','DRIVER']},carrierId:{...id,nullable:true}}}}})}}}};
for(const [project,spec]of [['fuelwise-microservice-mongo',mongo],['fuelwise-microservice-sql',sql],['fuelwise-bff',bff]])await writeFile(`projects/${project}/src/${project==='fuelwise-bff'?'':'api/'}openapi.js`,'export const spec = '+JSON.stringify(spec,null,2)+';\n');
