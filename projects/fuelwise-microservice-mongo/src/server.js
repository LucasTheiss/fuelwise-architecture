import { MongoClient } from 'mongodb';
import { createApp } from './app.js';
import { mongoRepository } from './infrastructure/repository.js';
import { identity } from './infrastructure/identity.js';
if(!process.env.MONGODB_URI)throw Error('MONGODB_URI required');
const client=new MongoClient(process.env.MONGODB_URI,{maxPoolSize:5,serverSelectionTimeoutMS:5000});
await client.connect();const repository=mongoRepository(client.db(process.env.MONGODB_DATABASE||'fuelwise_stations'));await repository.initialize();
const server=createApp({repository,authenticate:identity(process.env.LEGACY_URL)}).listen(Number(process.env.PORT||3001));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(async()=>{await client.close();process.exit(0);}));
