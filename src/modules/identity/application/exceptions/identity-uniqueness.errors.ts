import { IdentityException } from '@identity/domain/exceptions';

export class PersonDocumentAlreadyExistsException extends IdentityException {
  readonly statusCode = 409;
  readonly errorKey = 'PERSON_DOCUMENT_ALREADY_EXISTS';
  readonly errorCode = 'IDN_UNIQUENESS_001';

  constructor(documentTypeId: string, documentNumber: string) {
    super(`Ya existe una persona con el tipo "${documentTypeId}" y documento "${documentNumber}".`);
  }
}

export class PersonEmailAlreadyExistsException extends IdentityException {
  readonly statusCode = 409;
  readonly errorKey = 'PERSON_EMAIL_ALREADY_EXISTS';
  readonly errorCode = 'IDN_UNIQUENESS_002';

  constructor(email: string) {
    super(`Ya existe una persona con el correo "${email}".`);
  }
}

export class PersonPhoneAlreadyExistsException extends IdentityException {
  readonly statusCode = 409;
  readonly errorKey = 'PERSON_PHONE_ALREADY_EXISTS';
  readonly errorCode = 'IDN_UNIQUENESS_003';

  constructor(phone: string) {
    super(`Ya existe una persona con el teléfono "${phone}".`);
  }
}
