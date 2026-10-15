/** Erro de regra de negócio. Não conhece HTTP: a camada de API traduz o tipo em status. */
export class DomainError extends Error {
  constructor(kind, message) {
    super(message);
    this.name = 'DomainError';
    this.kind = kind; // 'validation' | 'not_found' | 'conflict'
  }
}
export const invalid = (message) => new DomainError('validation', message);
export const notFound = (item) => new DomainError('not_found', `${item} não encontrado`);
export const conflict = (message) => new DomainError('conflict', message);
