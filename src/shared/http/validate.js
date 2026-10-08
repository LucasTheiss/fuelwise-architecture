import { badRequest } from './errors.js';
import { z } from 'zod';
export { z };
export const uuid = z.string().uuid();
export const password = z.string().min(10).max(128).regex(/[A-Z]/, 'Requer maiúscula').regex(/[0-9]/, 'Requer número').regex(/[^a-zA-Z0-9]/, 'Requer caractere especial');
export const email = z.string().email().max(254).transform(v => v.toLowerCase().trim());
export const name = z.string().trim().min(2).max(150);
export const positive = z.coerce.number().positive().finite();
export const lat = z.coerce.number().min(-90).max(90);
export const lon = z.coerce.number().min(-180).max(180);
export const fuelType = z.enum(['DIESEL_S10','DIESEL_S500','GASOLINE','ETHANOL','ARLA32']);
export function parse(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) throw badRequest('Campos inválidos', result.error.flatten());
  return result.data;
}
export function qs(req, schema) { return parse(schema, req.query); }
export function body(req, schema) { return parse(schema, req.body); }
export function params(req, schema) { return parse(schema, req.params); }
export const paging = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) });
export const offset = (p) => (p.page - 1) * p.limit;
