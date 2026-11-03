export class DomainError extends Error {
  constructor(kind, message) { super(message); this.kind = kind; }
}
export const missing = () => new DomainError('not_found', 'Posto não encontrado');
