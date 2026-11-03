import {randomUUID} from 'node:crypto';
import {sql} from './database.js';
import {missing} from '../domain/trip.js';
export function sqlRepository(pool){
  const request=tx=>new sql.Request(tx||pool);
  const scope=(r,actor)=>r.input('tenant',sql.UniqueIdentifier,actor.carrierId).input('driver',sql.UniqueIdentifier,actor.role==='DRIVER'?actor.id:null);
  const where='carrier_id=@tenant AND (@driver IS NULL OR driver_id=@driver) AND is_active=1';
  async function transaction(fn){const tx=new sql.Transaction(pool);await tx.begin();try{const value=await fn(tx);await tx.commit();return value;}catch(e){await tx.rollback().catch(()=>{});throw e;}}
  async function event(tx,type,trip){const id=randomUUID();const payload={id,type,version:1,occurredAt:new Date().toISOString(),data:trip};await request(tx).input('id',sql.UniqueIdentifier,id).input('type',sql.VarChar(40),type).input('payload',sql.NVarChar(sql.MAX),JSON.stringify(payload)).query('INSERT INTO dbo.outbox(id,type,payload) VALUES(@id,@type,@payload)');}
  return {
    ready:()=>request().query('SELECT TOP 1 id FROM dbo.trip'),
    async create(data){return transaction(async tx=>{const r=await request(tx).input('id',sql.UniqueIdentifier,randomUUID()).input('tenant',sql.UniqueIdentifier,data.carrierId).input('driver',sql.UniqueIdentifier,data.driverId).input('vehicle',sql.UniqueIdentifier,data.vehicleId).input('notes',sql.NVarChar(500),data.notes||'').query('INSERT INTO dbo.trip(id,carrier_id,driver_id,vehicle_id,notes) OUTPUT inserted.* VALUES(@id,@tenant,@driver,@vehicle,@notes)');const trip=r.recordset[0];await event(tx,'TripCreated',trip);return trip;});},
    async list(actor,q){return(await scope(request(),actor).input('status',sql.VarChar(20),q.status||null).input('offset',sql.Int,(q.page-1)*q.limit).input('limit',sql.Int,q.limit).query(`SELECT * FROM dbo.trip WHERE ${where} AND (@status IS NULL OR status=@status) ORDER BY started_at DESC,id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`)).recordset;},
    async get(id,actor){return(await scope(request(),actor).input('id',sql.UniqueIdentifier,id).query(`SELECT * FROM dbo.trip WHERE id=@id AND ${where}`)).recordset[0]||null;},
    async mutate(id,actor,rule){return transaction(async tx=>{const r=await scope(request(tx),actor).input('id',sql.UniqueIdentifier,id).query(`SELECT * FROM dbo.trip WITH(UPDLOCK,HOLDLOCK) WHERE id=@id AND ${where}`);const old=r.recordset[0];if(!old)throw missing();const {changes,type}=rule(old);
      const next={...old,...changes};const changed=await request(tx).input('id',sql.UniqueIdentifier,id).input('notes',sql.NVarChar(500),next.notes).input('status',sql.VarChar(20),next.status).input('ended',sql.DateTime2,next.ended_at?new Date(next.ended_at):null).input('active',sql.Bit,next.is_active).query('UPDATE dbo.trip SET notes=@notes,status=@status,ended_at=@ended,is_active=@active,version=version+1 OUTPUT inserted.* WHERE id=@id');await event(tx,type,changed.recordset[0]);return changed.recordset[0];});},
    transaction,request
  };
}
