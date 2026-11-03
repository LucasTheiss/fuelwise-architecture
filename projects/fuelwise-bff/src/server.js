import {createApp} from './app.js';
import {httpClient} from './client.js';
for(const key of ['LEGACY_URL','STATIONS_URL','TRIPS_URL','FUNCTION_URL'])if(!process.env[key])throw Error(`${key} required`);
const server=createApp({client:httpClient(),legacyUrl:process.env.LEGACY_URL,stationsUrl:process.env.STATIONS_URL,tripsUrl:process.env.TRIPS_URL,functionUrl:process.env.FUNCTION_URL,functionKey:process.env.FUNCTION_KEY}).listen(Number(process.env.PORT||3003));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
