import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createApp} from '../src/app.js';
import {assertFinishable,assertVisible,assertDeletable,assertEditable} from '../src/domain/trip.js';
const actor={id:randomUUID(),carrierId:randomUUID(),role:'MANAGER'};
test('UUIDs SQL em maiúsculas preservam escopo da identidade PostgreSQL',()=>assert.doesNotThrow(()=>assertVisible({carrier_id:actor.carrierId.toUpperCase()},actor)));
test('preserva transições, pendências e isolamento',()=>{assert.throws(()=>assertFinishable({status:'IN_PROGRESS'},true));assert.throws(()=>assertFinishable({status:'FINISHED'},false));assert.throws(()=>assertDeletable({status:'IN_PROGRESS'}));assert.throws(()=>assertEditable({status:'FINISHED'}));assert.throws(()=>assertVisible({carrier_id:randomUUID()},actor));assert.throws(()=>assertVisible({carrier_id:actor.carrierId,driver_id:randomUUID()},{...actor,role:'DRIVER'}));});
test('CRUD HTTP viagem e bloqueio financeiro',async t=>{const rows=new Map();let pending=false;const repository={ready:async()=>{},create:async x=>{const v={id:randomUUID(),carrier_id:x.carrierId,driver_id:x.driverId,vehicle_id:x.vehicleId,notes:x.notes,status:'IN_PROGRESS',is_active:true};rows.set(v.id,v);return v;},list:async()=>[...rows.values()].filter(x=>x.is_active),get:async id=>rows.get(id)?.is_active?rows.get(id):null,mutate:async(id,a,rule)=>{const x=rows.get(id);Object.assign(x,rule(x).changes);return x;}};
const server=createApp({repository,authenticate:async()=>actor,fleet:{validateAssignment:async()=>{},hasPending:async()=>pending}}).listen(0);await new Promise(r=>server.once('listening',r));t.after(()=>new Promise(r=>server.close(r)));const base=`http://127.0.0.1:${server.address().port}/api/v1/trips`;const call=(p='',m='GET',b)=>fetch(base+p,{method:m,headers:{'content-type':'application/json'},...(b?{body:JSON.stringify(b)}:{})});
assert.equal((await call('','POST',{})).status,400);const response=await call('','POST',{driverId:randomUUID(),vehicleId:randomUUID()});assert.equal(response.status,201);const {trip}=await response.json();assert.equal((await call('/'+trip.id)).status,200);assert.equal((await(await call()).json()).items.length,1);assert.equal((await call('/'+trip.id,'PUT',{notes:'Destino atualizado'})).status,200);assert.equal((await call('/'+trip.id,'DELETE')).status,409);pending=true;assert.equal((await call('/'+trip.id+'/finish','PATCH')).status,409);pending=false;assert.equal((await call('/'+trip.id+'/finish','PATCH')).status,200);assert.equal((await call('/'+trip.id,'DELETE')).status,200);assert.equal((await call('/'+trip.id)).status,404);
});
test('índice único de viagem ativa vira 409 sem expor texto do SQL Server',async()=>{
  const {errors}=await import('../src/api/http.js');let sent;
  const r={headersSent:false,status(c){sent={status:c};return this;},json(b){sent.body=b;}};
  errors(Object.assign(Error("Cannot insert duplicate key row in object 'dbo.trip' with unique index 'uq_active_trip_driver'"),{number:2601}),{},r,()=>{});
  assert.equal(sent.status,409);assert.equal(sent.body.error.message,'Motorista ou veículo já possui viagem em andamento');
});
