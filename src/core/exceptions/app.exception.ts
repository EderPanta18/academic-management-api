// src/core/exceptions/app.exception.ts

export type ErrorKind =
  | 'DOMAIN'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'SYSTEM';

export abstract class AppException extends Error {
  abstract readonly kind: ErrorKind;
  abstract readonly errorCode: string;

  protected constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = new.target.name;
  }
}
