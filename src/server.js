import { assertConfig,config } from './shared/config.js';
import { pool } from './shared/db/pool.js';
import { createApp } from './app.js';
import { startOutboxWorker } from './shared/notifications/outbox.js';
assertConfig();
const app=createApp();
const server=app.listen(config.port,()=>console.log(JSON.stringify({event:'server_ready',port:config.port,env:config.env})));
const stopWorker=startOutboxWorker();
async function shutdown() {
  stopWorker();
  server.close(async ()=>{await pool.end();process.exit(0);});
  setTimeout(()=>process.exit(1),10000).unref();
}
process.on('SIGTERM',shutdown);
process.on('SIGINT',shutdown);
