// shared/domain/exceptions/domain.exception.ts

export abstract class DomainException extends Error {
  abstract readonly statusCode: number; // cada excepción concreta declara el suyo
  abstract readonly domain: string; // "PROFESSOR" | "STUDENT" | "COURSE" | "ENROLLMENT"
  abstract readonly errorKey: string;
  abstract readonly errorCode: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
