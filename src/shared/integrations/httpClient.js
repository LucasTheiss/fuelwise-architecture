import { unavailable } from '../http/errors.js';
import { config } from '../config.js';
const wait = (ms) => new Promise(resolve => setTimeout(resolve,ms));
/** Only repeat idempotent calls; for mutating payment calls retry is opt-in with provider guarantee. */
export async function externalJSON(url, { method='GET', apiKey='', body, idempotencyKey, retries=2 }={}) {
  for (let attempt=0;attempt<=retries;attempt++) {
    try {
      const response = await fetch(url, {
        method, signal: AbortSignal.timeout(config.timeoutMs),
        headers: { 'Accept':'application/json', ...(body ? {'Content-Type':'application/json'} : {}),
          ...(apiKey ? {'Authorization': `Bearer ${apiKey}`} : {}),
          ...(idempotencyKey ? {'Idempotency-Key': idempotencyKey} : {}) },
        ...(body ? {body:JSON.stringify(body)}:{})
      });
      if (!response.ok) {
        if (response.status >= 500 && attempt < retries) { await wait(150 * 2**attempt); continue; }
        throw unavailable(`Integração externa indisponível (HTTP ${response.status})`);
      }
      return await response.json();
    } catch (error) {
      if (attempt < retries && (error.name === 'TimeoutError' || error.name === 'TypeError')) {
        await wait(150 * 2**attempt); continue;
      }
      throw unavailable('Falha na comunicação com serviço externo');
    }
  }
}
