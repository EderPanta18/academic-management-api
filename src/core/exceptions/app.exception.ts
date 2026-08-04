// src/core/exceptions/app.exception.ts

export abstract class AppException extends Error {
  abstract readonly statusCode: number;
  abstract readonly errorKey: string;
  abstract readonly errorCode: string;

  override readonly cause?: unknown;

  protected constructor(message: string, cause?: unknown) {
    super(message, { cause });

    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
