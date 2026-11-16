// src/modules/persons/application/exceptions/person-relation.errors.ts

import { PersonException } from '@persons/domain/exceptions';

export class PersonDocumentTypeNotFoundException extends PersonException {
  readonly reason = 'NOT_FOUND';
  readonly errorCode = 'PERSON_DOCUMENT_TYPE_NOT_FOUND';

  constructor(documentTypeId: string) {
    super(`No se encontró un tipo de documento con el id "${documentTypeId}".`);
  }
}
