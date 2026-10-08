import 'dotenv/config';

const get = (key, fallback = '') => process.env[key] ?? fallback;
export const config = Object.freeze({
  env: get('NODE_ENV', 'development'),
  port: Number(get('PORT', '3000')),
  databaseUrl: get('DATABASE_URL'),
  dbSSL: get('DB_SSL', 'false') === 'true',
  jwtSecret: get('JWT_SECRET'),
  jwtExpiresIn: get('JWT_EXPIRES_IN', '15m'),
  accessTTL: Number(get('ACCESS_TOKEN_TTL_SECONDS', '900')),
  refreshDays: Number(get('REFRESH_TOKEN_DAYS', '7')),
  corsOrigin: get('CORS_ORIGIN', 'http://localhost:5173').split(',').map(s => s.trim()),
  integrationMode: get('INTEGRATION_MODE', 'mock'),
  paymentProvider: get('PAYMENT_PROVIDER', get('INTEGRATION_MODE', 'mock') === 'mock' ? 'mock' : 'http'),
  paymentUrl: get('PAYMENT_API_URL'),
  paymentKey: get('PAYMENT_API_KEY'),
  paymentSupportsIdempotency: get('PAYMENT_SUPPORTS_IDEMPOTENCY') === 'true',
  gpsUrl: get('GPS_API_URL'),
  gpsKey: get('GPS_API_KEY'),
  stationsUrl: get('STATIONS_API_URL'),
  stationsKey: get('STATIONS_API_KEY'),
  fcmProjectId: get('FCM_PROJECT_ID'),
  fcmClientEmail: get('FCM_CLIENT_EMAIL'),
  fcmPrivateKey: get('FCM_PRIVATE_KEY').replace(/\\n/g, '\n'),
  timeoutMs: Number(get('EXTERNAL_TIMEOUT_MS', '5000')),
  outboxIntervalMs: Number(get('OUTBOX_INTERVAL_MS', '10000'))
});
export function assertConfig() {
  if (!config.databaseUrl) throw Error('DATABASE_URL obrigatória');
  if (!config.jwtSecret || config.jwtSecret.length < 32) throw Error('JWT_SECRET deve ter pelo menos 32 caracteres');
  if (!['mock','live'].includes(config.integrationMode)) throw Error('INTEGRATION_MODE must be mock or live');
  if (!['mock','http'].includes(config.paymentProvider)) throw Error('PAYMENT_PROVIDER must be mock or http');
  if (config.env === 'production') {
    if (config.integrationMode === 'mock') throw Error('Mock integrations are prohibited in production');
    if (config.paymentProvider === 'mock') throw Error('Gateway simulated é proibido em produção');
    if (!config.paymentUrl || !config.paymentKey || !config.paymentSupportsIdempotency) {
      throw Error('Gateway real e idempotência contratual obrigatórios em produção');
    }
    if (config.corsOrigin.includes('*')) throw Error('CORS_ORIGIN não pode usar * em produção');
  }
}
