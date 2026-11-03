import test from 'node:test';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {connect,sql} from '../src/infrastructure/database.js';import {sqlRepository} from '../src/infrastructure/repository.js';import {eventAdapters} from '../src/infrastructure/events.js';
test('SQL real: CRUD, concorrência, outbox atômico e duplicidade', {skip:process.env.RUN_SQL_INTEGRATION!=='true'},async t=>{
  const pool=await connect();const repo=sqlRepository(pool);const actor={id:randomUUID(),role:'MANAGER',carrierId:randomUUID()};const input={carrierId:actor.carrierId,driverId:randomUUID(),vehicleId:randomUUID(),notes:'Integration test'};
  t.after(async()=>{const request=()=>new sql.Request(pool).input('tenant',sql.UniqueIdentifier,actor.carrierId);await request().query('DELETE FROM dbo.trip_audit WHERE carrier_id=@tenant');await request().query("DELETE FROM dbo.outbox WHERE JSON_VALUE(payload,'$.data.carrier_id')=CONVERT(varchar(36),@tenant)");await request().query('DELETE FROM dbo.trip WHERE carrier_id=@tenant');await pool.close();});
  const results=await Promise.allSettled([repo.create(input),repo.create(input)]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);const trip=results.find(r=>r.status==='fulfilled').value;
  assert.ok(await repo.get(trip.id,actor));assert.equal(await repo.get(trip.id,{...actor,carrierId:randomUUID()}),null);assert.equal((await repo.list(actor,{page:1,limit:20})).length,1);
  await repo.mutate(trip.id,actor,()=>({changes:{notes:'updated'},type:'TripUpdated'}));assert.equal((await repo.get(trip.id,actor)).notes,'updated');
  const events=(await new sql.Request(pool).input('id',sql.UniqueIdentifier,trip.id).query("SELECT payload FROM dbo.outbox WHERE JSON_VALUE(payload,'$.data.id')=CONVERT(varchar(36),@id) AND type='TripCreated'")).recordset;assert.equal(events.length,1,'Rollback must not publish a phantom event');
  const event=JSON.parse(events[0].payload);const {consumer}=eventAdapters(repo);await consumer.consume(event);await consumer.consume(event);
  const audit=await new sql.Request(pool).input('id',sql.UniqueIdentifier,event.id).query('SELECT COUNT(*) AS total FROM dbo.trip_audit WHERE event_id=@id');assert.equal(audit.recordset[0].total,1);
  await repo.mutate(trip.id,actor,()=>({changes:{status:'FINISHED',ended_at:new Date()},type:'TripFinished'}));await repo.mutate(trip.id,actor,()=>({changes:{is_active:false},type:'TripDeactivated'}));assert.equal(await repo.get(trip.id,actor),null);
});
