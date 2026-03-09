// core/domain/exceptions/domain.exception.ts

export abstract class DomainException extends Error {
  abstract readonly statusCode: number;
  abstract readonly domain: string;
  abstract readonly errorKey: string;
  abstract readonly errorCode: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
