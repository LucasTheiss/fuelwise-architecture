import { createSign } from 'node:crypto';
import { config } from '../config.js';
import { makeMockNotifier } from './mockAdapters.js';
import { externalJSON } from './httpClient.js';
/** Firebase HTTP v1 with service-account JWT OAuth exchange; no fake delivery when unconfigured. */
const encode = (v) => Buffer.from(JSON.stringify(v)).toString('base64url');
let cache = { token:null, until:0 };
async function accessToken() {
  if (cache.until > Date.now()+60000) return cache.token;
  if (!config.fcmProjectId || !config.fcmClientEmail || !config.fcmPrivateKey) throw Error('FCM not configured');
  const now = Math.floor(Date.now()/1000);
  const unsigned = `${encode({alg:'RS256',typ:'JWT'})}.${encode({iss:config.fcmClientEmail,scope:'https://www.googleapis.com/auth/firebase.messaging',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})}`;
  const signer = createSign('RSA-SHA256'); signer.update(unsigned); signer.end();
  const assertion = `${unsigned}.${signer.sign(config.fcmPrivateKey,'base64url')}`;
  const resp = await fetch('https://oauth2.googleapis.com/token',{
    method:'POST',signal:AbortSignal.timeout(config.timeoutMs),headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})
  });
  if (!resp.ok) throw Error(`FCM OAuth error: ${resp.status}`);
  const json = await resp.json();
  cache={token:json.access_token,until:Date.now()+(Number(json.expires_in)||3600)*1000};
  return cache.token;
}
export function makeNotifier() {
  if (config.integrationMode === 'mock') return makeMockNotifier();
  return {
    simulated: false,
    async send(token, payload) {
      const auth = await accessToken();
      return externalJSON(`https://fcm.googleapis.com/v1/projects/${encodeURIComponent(config.fcmProjectId)}/messages:send`,{
        method:'POST',retries:0,apiKey:auth,
        body:{message:{token,notification:{title:'FuelWise',body:String(payload.message||payload.type||'FuelWise update')},data:{type:String(payload.type||'INFO')}}}
      });
    }
  };
}
