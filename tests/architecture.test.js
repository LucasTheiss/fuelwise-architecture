import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const db=await readFile(resolve('database/migrations/001_initial.sql'),'utf8');
test('integridade do DER: payment único por fueling',()=>assert.match(db,/fueling_id uuid NOT NULL UNIQUE/));
test('denúncia exige somente um alvo',()=>assert.match(db,/CHECK \(\(station_id IS NOT NULL\) <> \(payment_id IS NOT NULL\)\)/));
test('trips ativas não podem concorrer',()=>{
  assert.match(db,/uq_active_trip_driver/);
  assert.match(db,/uq_active_trip_vehicle/);
});
test('vertical slices organizadas por caso de uso',async()=>{
  const dirs=await readdir(resolve('src/slices/payments'),{withFileTypes:true});
  assert.ok(dirs.some(x=>x.name==='pay'&&x.isDirectory()));
  assert.ok(dirs.some(x=>x.name==='reconcile'&&x.isDirectory()));
});
