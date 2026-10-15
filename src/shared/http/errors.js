import { DomainError } from '../../domain/errors.js';
export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
export const badRequest = (message, details) => new AppError(400, 'VALIDATION_ERROR', message, details);
export const unauthenticated = () => new AppError(401, 'UNAUTHENTICATED', 'Autenticação necessária');
export const forbidden = () => new AppError(403, 'FORBIDDEN', 'Acesso negado');
export const notFound = (item = 'Recurso') => new AppError(404, 'NOT_FOUND', `${item} não encontrado`);
export const conflict = (message) => new AppError(409, 'CONFLICT', message);
export const unavailable = (message) => new AppError(503, 'SERVICE_UNAVAILABLE', message);
export const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err instanceof DomainError) err = err.kind === 'not_found' ? new AppError(404, 'NOT_FOUND', err.message)
    : err.kind === 'conflict' ? conflict(err.message) : badRequest(err.message);
  else if (err.code === '23505') err = conflict('Registro duplicado ou operação concorrente em conflito');
  else if (err.code === '23503') err = badRequest('Referência inexistente');
  else if (err.code === '23514' || err.code === '22P02') err = badRequest('Dados não atendem às regras de integridade');
  const status = err.status ?? 500;
  if (status >= 500) console.error(JSON.stringify({ level: 'error', event: 'http_error', path: req.path, error: err.message }));
  res.status(status).json({ error: { code: err.code ?? 'INTERNAL_ERROR', message: status === 500 ? 'Erro interno' : err.message, ...(err.details ? { details: err.details } : {}) } });
}
