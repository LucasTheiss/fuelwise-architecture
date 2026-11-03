import {readFile} from 'node:fs/promises';
import {connect,sql} from '../src/infrastructure/database.js';
const pool=await connect();const tx=new sql.Transaction(pool);
try{await tx.begin();await new sql.Request(tx).query("EXEC sp_getapplock @Resource='fuelwise_migrations', @LockMode='Exclusive', @LockOwner='Transaction'");await new sql.Request(tx).batch(await readFile(new URL('../database/001_trips.sql',import.meta.url),'utf8'));await tx.commit();console.log('SQL migration applied');}catch(e){await tx.rollback().catch(()=>{});throw e;}finally{await pool.close();}
