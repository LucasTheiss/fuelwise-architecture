import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createApp } from '../src/app.js';
import { mongoRepository } from '../src/infrastructure/repository.js';
import { MongoClient } from 'mongodb';
function memory(){const rows=new Map();return {ready:async()=>{},create:async data=>{const row={id:randomUUID(),...data,is_active:true};rows.set(row.id,row);return row;},list:async()=>[...rows.values()].filter(x=>x.is_active),get:async id=>rows.get(id)?.is_active?rows.get(id):null,update:async(id,data)=>{if(!rows.get(id)?.is_active)return null;Object.assign(rows.get(id),data);return rows.get(id);},deactivate:async id=>{if(!rows.get(id)?.is_active)return null;rows.get(id).is_active=false;return rows.get(id);},addPrice:async()=>({}),prices:async()=>[],currentPrices:async()=>[]};}
async function crud(t,repository){const server=createApp({repository,authenticate:async token=>{if(!token)throw Object.assign(Error('Login required'),{status:401});return {id:randomUUID(),role:token==='Bearer admin'?'ADMIN':'DRIVER'};}}).listen(0);await new Promise(r=>server.once('listening',r));t.after(()=>new Promise(r=>server.close(r)));const base=`http://127.0.0.1:${server.address().port}/api/v1/stations`;
const call=(path='',method='GET',body,token='admin')=>fetch(base+path,{method,headers:{'content-type':'application/json',...(token?{authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
assert.equal((await call('','GET',null,null)).status,401);
const data={name:'Posto Teste',address:'Rua de Teste 123',latitude:-25,longitude:-49,isAffiliated:true};
assert.equal((await call('','POST',data,'driver')).status,403);assert.equal((await call('','POST',{...data,latitude:100})).status,400);
const response=await call('','POST',data);assert.equal(response.status,201);const {station}=await response.json();
assert.equal((await call('/'+station.id)).status,200);assert.ok((await(await call()).json()).items.some(x=>x.id===station.id));
assert.equal((await call('/'+station.id,'PUT',{...data,name:'Posto Editado'})).status,200);
assert.equal((await call('/'+station.id,'DELETE')).status,200);assert.equal((await call('/'+station.id)).status,404);}
test('CRUD HTTP, validação e RBAC com porta isolada',async t=>crud(t,memory()));
test('CRUD com MongoDB real (banco exclusivo de teste)',{skip:!process.env.TEST_MONGODB_URI},async t=>{const client=new MongoClient(process.env.TEST_MONGODB_URI);await client.connect();const db=client.db('fuelwise_test_'+randomUUID().replaceAll('-',''));t.after(async()=>{await db.dropDatabase();await client.close();});const repo=mongoRepository(db);await repo.initialize();await crud(t,repo);});
