// modules/identity/application/exceptions/identity-relation.errors.ts

import { IdentityException } from '@identity/domain/exceptions';

export class PersonDocumentTypeNotFoundException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'PERSON_DOCUMENT_TYPE_NOT_FOUND';
  readonly errorCode = 'IDN_RELATION_001';

  constructor(documentTypeId: string) {
    super(`Tipo de documento con id "${documentTypeId}" no se encontró.`);
  }
}
