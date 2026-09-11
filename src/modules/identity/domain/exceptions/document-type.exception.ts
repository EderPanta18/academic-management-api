import { IdentityException } from './identity.exception';

export abstract class DocumentTypeException extends IdentityException {
  readonly entity = 'DOCUMENT_TYPE';
}
