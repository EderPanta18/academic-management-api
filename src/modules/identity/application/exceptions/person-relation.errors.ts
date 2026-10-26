// src/modules/identity/application/exceptions/person-relation.errors.ts

import { PersonException } from '@identity/domain/exceptions';

export class PersonDocumentTypeNotFoundException extends PersonException {
  readonly reason = 'NOT_FOUND' as const;
  readonly errorCode = 'PER_RELATION_001';

  constructor(documentTypeId: string) {
    super(`No se encontró un tipo de documento con el id "${documentTypeId}".`);
  }
}
