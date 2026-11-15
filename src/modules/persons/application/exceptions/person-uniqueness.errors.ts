// src/modules/identity/application/exceptions/person-uniqueness.errors.ts

import { PersonException } from '@persons/domain/exceptions';

export class PersonDocumentAlreadyExistsException extends PersonException {
  readonly reason = 'CONFLICT';
  readonly errorCode = 'PERSON_DOCUMENT_ALREADY_EXISTS';

  constructor(documentTypeId: string, documentNumber: string) {
    super(
      `Ya existe un registro con el documento "${documentNumber}" para el tipo "${documentTypeId}".`,
    );
  }
}

export class PersonEmailAlreadyExistsException extends PersonException {
  readonly reason = 'CONFLICT';
  readonly errorCode = 'PERSON_EMAIL_ALREADY_EXISTS';

  constructor(email: string) {
    super(`Ya existe una persona con el correo "${email}".`);
  }
}
