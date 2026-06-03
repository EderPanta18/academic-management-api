// core/exceptions/entity-not-found.exception.ts

import { DomainException } from './domain.exception';

export class EntityNotFoundException extends DomainException {
  readonly domain = 'CORE';
  readonly statusCode = 404;
  readonly errorKey = 'ENTITY_NOT_FOUND';
  readonly errorCode = 'CORE_001';

  constructor(entityName: string, id: number) {
    super(`No se encontró ${entityName} con id ${id}`);
  }
}
