/** Self-contained providers for local acceptance tests. Nothing calls the network. */
const sampleStations = Object.freeze([
  { id: 'mock-station-1', name: 'Demo Station North (fictional)', address: 'Demo location only', latitude: -25.411, longitude: -49.265, isAffiliated: true, simulated: true },
  { id: 'mock-station-2', name: 'Demo Station South (fictional)', address: 'Demo location only', latitude: -25.447, longitude: -49.282, isAffiliated: false, simulated: true }
]);

export function makeMockPaymentGateway() {
  return {
    simulated: true,
    async charge({ paymentId }) {
      return { status: 'APPROVED', transactionId: `MOCK-${paymentId}`, message: 'SIMULATED PAYMENT - no money transferred' };
    },
    async check({ paymentId }) {
      return { status: 'APPROVED', transactionId: `MOCK-${paymentId}`, message: 'SIMULATED RECONCILIATION' };
    }
  };
}

export function makeMockGpsProvider() {
  return {
    simulated: true,
    async locate(_vehicleId) {
      return { latitude: -25.4284, longitude: -49.2733, recordedAt: new Date().toISOString() };
    }
  };
}

export function makeMockStationProvider() {
  return {
    simulated: true,
    async list() { return sampleStations.map(station => ({ ...station })); }
  };
}

export function makeMockNotifier() {
  return {
    simulated: true,
    async send(_token, payload) {
      console.info(JSON.stringify({ level: 'info', event: 'notification_simulated', notificationType: String(payload.type || 'INFO') }));
      return { simulated: true };
    }
  };
}
