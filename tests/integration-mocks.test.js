import test from 'node:test';
import assert from 'node:assert/strict';
import { makeMockPaymentGateway, makeMockGpsProvider, makeMockStationProvider, makeMockNotifier } from '../src/shared/integrations/mockAdapters.js';

test('payment mock uses database-compatible English status and never moves money', async () => {
  const gateway = makeMockPaymentGateway();
  assert.equal(gateway.simulated, true);
  const payment = await gateway.charge({ paymentId: 'test-123', amount: '100.00', idempotencyKey: 'test-key' });
  assert.equal(payment.status, 'APPROVED');
  assert.equal(payment.transactionId, 'MOCK-test-123');
  assert.equal((await gateway.check({ paymentId: 'test-123' })).status, 'APPROVED');
});
test('GPS mock always exposes simulated coordinates', async () => {
  const provider = makeMockGpsProvider();
  assert.equal(provider.simulated, true);
  const location = await provider.locate('test-vehicle');
  assert.ok(location.latitude >= -90 && location.latitude <= 90);
  assert.ok(location.longitude >= -180 && location.longitude <= 180);
  assert.ok(!Number.isNaN(Date.parse(location.recordedAt)));
});
test('external station mock has explicitly fictional entries', async () => {
  const provider = makeMockStationProvider();
  const stations = await provider.list();
  assert.equal(provider.simulated, true);
  assert.ok(stations.length >= 1);
  assert.ok(stations.every(s => s.simulated && s.name.includes('(fictional)')));
});
test('notification mock does not call Firebase', async () => {
  const sender = makeMockNotifier();
  assert.equal(sender.simulated, true);
  const result = await sender.send(null, { type: 'TEST', message: 'Test notification' });
  assert.equal(result.simulated, true);
});
