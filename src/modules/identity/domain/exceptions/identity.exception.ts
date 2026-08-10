import { DomainException } from '@core/exceptions';

export abstract class IdentityException extends DomainException {
  readonly domain = 'IDENTITY';
}
