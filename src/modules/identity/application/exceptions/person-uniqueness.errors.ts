// src/modules/identity/application/exceptions/person-uniqueness.errors.ts

import { PersonException } from '@identity/domain/exceptions';

export class PersonDocumentAlreadyExistsException extends PersonException {
  readonly reason = 'CONFLICT' as const;
  readonly errorCode = 'PER_UNIQUENESS_001';

  constructor(documentTypeId: string, documentNumber: string) {
    super(`Ya existe una persona con el tipo "${documentTypeId}" y documento "${documentNumber}".`);
  }
}

export class PersonEmailAlreadyExistsException extends PersonException {
  readonly reason = 'CONFLICT' as const;
  readonly errorCode = 'PER_UNIQUENESS_002';

  constructor(email: string) {
    super(`Ya existe una persona con el correo "${email}".`);
  }
}
