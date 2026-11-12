import {createApp} from './app.js';
import {httpClient} from './client.js';
for(const key of ['LEGACY_URL','STATIONS_URL','TRIPS_URL','FUNCTION_URL'])if(!process.env[key])throw Error(`${key} required`);
// HTTP_TIMEOUT_MS: raise for scale-to-zero hosts (cold starts); keep below the gateway's 12 s.
const server=createApp({client:httpClient({timeoutMs:Number(process.env.HTTP_TIMEOUT_MS||5000)}),legacyUrl:process.env.LEGACY_URL,stationsUrl:process.env.STATIONS_URL,tripsUrl:process.env.TRIPS_URL,functionUrl:process.env.FUNCTION_URL,functionKey:process.env.FUNCTION_KEY}).listen(Number(process.env.PORT||3003));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
