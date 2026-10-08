import { config } from '../config.js';
import { makeMockPaymentGateway } from './mockAdapters.js';
import { externalJSON } from './httpClient.js';
import { unavailable } from '../http/errors.js';

/** Payment port: charge/check -> { status: 'APPROVED'|'REJECTED'|'UNKNOWN', transactionId, message }. */
export function makeGateway() {
  if (config.paymentProvider === 'mock') return makeMockPaymentGateway();
  if (config.paymentProvider !== 'http' || !config.paymentUrl || !config.paymentKey) throw Error('Invalid payment gateway configuration');
  return {
    simulated: false,
    async charge({ paymentId, amount, idempotencyKey }) {
      const r = await externalJSON(`${config.paymentUrl.replace(/\/$/,'')}/charges`, {
        method: 'POST', apiKey: config.paymentKey, idempotencyKey,
        retries: config.paymentSupportsIdempotency ? 2 : 0,
        body: { reference: paymentId, amount, currency: 'BRL' }
      });
      if (!['APPROVED','REJECTED'].includes(r.status) || !r.transactionId) throw unavailable('Unknown payment gateway response; reconciliation required');
      return { status: r.status, transactionId: String(r.transactionId), message: r.message || null };
    },
    async check({ paymentId }) {
      const r = await externalJSON(`${config.paymentUrl.replace(/\/$/,'')}/charges/${encodeURIComponent(paymentId)}`, { apiKey: config.paymentKey });
      if (!['APPROVED','REJECTED','UNKNOWN'].includes(r.status)) throw unavailable('Invalid reconciliation response');
      return { status: r.status, transactionId: r.transactionId ? String(r.transactionId) : null, message: r.message || null };
    }
  };
}
