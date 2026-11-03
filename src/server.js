import { assertConfig,config } from './shared/config.js';
import { pool } from './shared/db/pool.js';
import { createApp } from './app.js';
import { startOutboxWorker } from './shared/notifications/outbox.js';
import { makeNotifier } from './shared/integrations/fcmSender.js';
assertConfig();
if(process.env.DOMAIN_MODE==='distributed'){
  const {rows}=await pool.query('SELECT (SELECT count(*) FROM trip)+(SELECT count(*) FROM station) AS count');
  if(Number(rows[0].count)>0)throw Error('Distributed mode requires an empty legacy trip/station domain. Existing data needs a reviewed migration; no automatic deletion.');
}
const app=createApp();
const server=app.listen(config.port,()=>console.log(JSON.stringify({event:'server_ready',port:config.port,env:config.env})));
const stopWorker=startOutboxWorker(makeNotifier());
async function shutdown() {
  stopWorker();
  server.close(async ()=>{await pool.end();process.exit(0);});
  setTimeout(()=>process.exit(1),10000).unref();
}
process.on('SIGTERM',shutdown);
process.on('SIGINT',shutdown);
