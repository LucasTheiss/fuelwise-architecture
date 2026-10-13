import { config } from '../config.js';
import { makeMockStationProvider } from './mockAdapters.js';
import { externalJSON } from './httpClient.js';
import { unavailable } from '../http/errors.js';

export function makeStationProvider() {
  if (config.integrationMode === 'mock') return makeMockStationProvider();
  return {
    simulated: false,
    async list() {
      if (!config.stationsUrl) throw unavailable('External station provider not configured');
      const result = await externalJSON(`${config.stationsUrl.replace(/\/$/,'')}/stations`, { apiKey: config.stationsKey });
      if (!Array.isArray(result.stations)) throw unavailable('Invalid external station response');
      return result.stations;
    }
  };
}
