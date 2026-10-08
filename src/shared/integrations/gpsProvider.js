import { config } from '../config.js';
import { makeMockGpsProvider } from './mockAdapters.js';
import { externalJSON } from './httpClient.js';
import { unavailable } from '../http/errors.js';

/** Simulated reference coordinate is NOT a real vehicle location. */
export function makeGpsProvider() {
  if (config.integrationMode === 'mock') return makeMockGpsProvider();
  return {
    simulated: false,
    async locate(vehicleId) {
      if (!config.gpsUrl) throw unavailable('GPS provider not configured');
      const r = await externalJSON(`${config.gpsUrl.replace(/\/$/,'')}/vehicles/${encodeURIComponent(vehicleId)}/location`, { apiKey: config.gpsKey });
      const latitude = Number(r.latitude), longitude = Number(r.longitude);
      if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) throw unavailable('Invalid GPS coordinates');
      const recordedAt = new Date(r.recordedAt ?? Date.now());
      if (Number.isNaN(recordedAt.getTime())) throw unavailable('Invalid GPS timestamp');
      return { latitude, longitude, recordedAt: recordedAt.toISOString() };
    }
  };
}
