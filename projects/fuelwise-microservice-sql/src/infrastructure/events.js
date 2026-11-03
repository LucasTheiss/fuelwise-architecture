import {sql} from './database.js';
export function eventAdapters(repository){const {transaction,request}=repository;return {
  outbox:{
    async claim(){return(await request().query(`UPDATE dbo.outbox SET dead_letter=1 WHERE attempts>=5 AND delivered_at IS NULL AND available_at<=SYSUTCDATETIME();
      ;WITH due AS (SELECT TOP(10) * FROM dbo.outbox WITH(UPDLOCK,READPAST,ROWLOCK)
      WHERE delivered_at IS NULL AND dead_letter=0 AND attempts<5 AND available_at<=SYSUTCDATETIME() ORDER BY occurred_at)
      UPDATE due SET attempts=attempts+1,available_at=DATEADD(second,60,SYSUTCDATETIME()) OUTPUT inserted.id,inserted.payload,inserted.attempts;`)).recordset;},
    ack:id=>request().input('id',sql.UniqueIdentifier,id).query('UPDATE dbo.outbox SET delivered_at=SYSUTCDATETIME() WHERE id=@id'),
    retry:(id,attempts)=>request().input('id',sql.UniqueIdentifier,id).input('delay',sql.Int,Math.min(3600,5*2**attempts)).query('UPDATE dbo.outbox SET dead_letter=CASE WHEN attempts>=5 THEN 1 ELSE 0 END,available_at=DATEADD(second,@delay,SYSUTCDATETIME()) WHERE id=@id')
  },
  consumer:{async consume(event){await transaction(async tx=>{const exists=await request(tx).input('id',sql.UniqueIdentifier,event.id).query('SELECT event_id FROM dbo.trip_audit WITH(UPDLOCK,HOLDLOCK) WHERE event_id=@id');if(exists.recordset.length)return;
    await request(tx).input('id',sql.UniqueIdentifier,event.id).input('trip',sql.UniqueIdentifier,event.data.id).input('tenant',sql.UniqueIdentifier,event.data.carrier_id).input('type',sql.VarChar(40),event.type).input('payload',sql.NVarChar(sql.MAX),JSON.stringify(event)).query('INSERT INTO dbo.trip_audit(event_id,trip_id,carrier_id,type,payload) VALUES(@id,@trip,@tenant,@type,@payload)');});}}
};}
