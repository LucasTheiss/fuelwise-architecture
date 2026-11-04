import assert from 'node:assert/strict';
import dotenv from 'dotenv';
dotenv.config({path: '.env.function-runtime'});
const url = process.env.FUNCTION_RUNTIME_URL || 'http://localhost:7071/api/indicators';
assert.ok(process.env.FUNCTION_KEY, 'FUNCTION_KEY is required');
async function call(body, key = process.env.FUNCTION_KEY) {
  return fetch(url, {
    method: 'POST', headers: {'content-type': 'application/json', ...(key ? {'x-functions-key': key} : {})},
    body: typeof body === 'string' ? body : JSON.stringify(body), signal: AbortSignal.timeout(10000)
  });
}
const sample = {stations: [{id: 'station'}], trips: [{id: 'trip', status: 'IN_PROGRESS'}]};
// Allow a cold Functions host to index the JavaScript entry point.
for (let attempt = 0; attempt < 60; attempt++) {
  try { if ((await call(sample, null)).status === 401) break; } catch {}
  if (attempt === 59) throw new Error('Functions host did not become ready within the startup window');
  await new Promise(resolve => setTimeout(resolve, 1000));
}
assert.equal((await call(sample, null)).status, 401, 'Host must enforce authLevel=function');
assert.equal((await call(sample, 'invalid')).status, 401);
const response = await call(sample);
assert.equal(response.status, 200);
assert.deepEqual(await response.json(), {totalStations: 1, totalTrips: 1, activeTrips: 1, finishedTrips: 0, complete: true});
const partial = await call({stations: null, trips: []});
assert.equal(partial.status, 200);
assert.equal((await partial.json()).totalStations, null);
assert.equal((await call('{')).status, 400);
assert.equal((await call({stations: [], trips: [{id: 'x', status: 'INVALID'}]})).status, 400);
console.log('PASS: official Functions host, key enforcement, indicators, partial input and validation');
