// src/core/exceptions/domain.exception.ts

import { AppException } from './app.exception';

/**
 * Clasifica la naturaleza de un error de dominio.
 *
 * - VALIDATION (400):
 *   Datos inválidos detectados por una validación funcional,
 *   sin confundirlos con una regla académica incumplida.
 *
 * - CONFLICT (409):
 *   Una operación contradice un estado, una regla de negocio
 *   o una condición concurrente.
 *
 * - NOT_FOUND (404):
 *   Una entidad o referencia requerida no existe o no puede
 *   revelarse dentro del acceso autorizado.
 *
 * Los códigos HTTP son equivalencias de referencia.
 * Su aplicación corresponde al adaptador HTTP, no al dominio.
 */
export type DomainErrorReason = 'VALIDATION' | 'CONFLICT' | 'NOT_FOUND';

export abstract class DomainException extends AppException {
  readonly kind = 'DOMAIN' as const;

  abstract readonly domain: string;
  abstract readonly reason: DomainErrorReason;

  protected constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
