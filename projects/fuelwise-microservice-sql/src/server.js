import {createApp} from './app.js';
import {connect} from './infrastructure/database.js';
import {sqlRepository} from './infrastructure/repository.js';
import {identity} from './infrastructure/identity.js';
import {fleet} from './infrastructure/fleet.js';
const pool=await connect();const repository=sqlRepository(pool);const server=createApp({repository,authenticate:identity(process.env.LEGACY_URL),fleet:fleet(process.env.LEGACY_URL)}).listen(Number(process.env.PORT||3002));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(async()=>{await pool.close();process.exit(0);}));
