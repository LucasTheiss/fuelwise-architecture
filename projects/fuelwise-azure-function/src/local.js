// Development adapter for the SAME handler. Final demo must use Azure Functions.
import {createServer} from 'node:http';
import {handler} from './indicators.js';
createServer(async(q,r)=>{if(q.method!=='POST'||q.url!=='/api/indicators'){r.writeHead(404);r.end();return;}let body='';try{for await(const chunk of q){body+=chunk;if(Buffer.byteLength(body)>65536){r.writeHead(413);r.end();return;}}const result=await handler({json:async()=>JSON.parse(body)});r.writeHead(result.status,{'content-type':'application/json'});r.end(JSON.stringify(result.jsonBody));}catch{r.writeHead(400);r.end();}}).listen(Number(process.env.PORT||7071));
