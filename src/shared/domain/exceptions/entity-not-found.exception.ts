// shared/domain/exceptions/entity-not-found.exception.ts

import { DomainException } from './domain.exception';

/**
 * Excepción transversal para cuando un módulo valida la existencia
 * de una entidad que pertenece a otro módulo y no la encuentra.
 *
 * Ejemplos:
 *   throw new EntityNotFoundException('Course', command.courseId);
 *   throw new EntityNotFoundException('AcademicPeriod', command.academicPeriodId);
 */
export class EntityNotFoundException extends DomainException {
  readonly domain = 'CORE';
  readonly statusCode = 404;
  readonly errorKey = 'ENTITY_NOT_FOUND';
  readonly errorCode = 'CORE_001';

  constructor(entityName: string, id: number) {
    super(`No se encontró ${entityName} con id ${id}`);
  }
}
