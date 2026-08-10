import { IdentityException } from '@identity/domain/exceptions';

export class InvalidPersonDocumentNumberLengthException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_PERSON_DOCUMENT_NUMBER_LENGTH';
  readonly errorCode = 'PER_VALIDATION_001';

  constructor(documentNumber: string, minLength: number, maxLength: number) {
    super(
      `El número de documento "${documentNumber}" debe tener entre ${minLength} y ${maxLength} caracteres.`,
    );
  }
}

export class InvalidPersonDocumentNumberFormatException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_PERSON_DOCUMENT_NUMBER_FORMAT';
  readonly errorCode = 'PER_VALIDATION_002';

  constructor(documentNumber: string) {
    super(`El número de documento "${documentNumber}" no cumple con el formato esperado.`);
  }
}

export class InvalidPersonFirstNameLengthException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_PERSON_FIRST_NAME_LENGTH';
  readonly errorCode = 'PER_VALIDATION_003';

  constructor(firstName: string, minLength: number, maxLength: number) {
    super(`El nombre "${firstName}" debe tener entre ${minLength} y ${maxLength} caracteres.`);
  }
}

export class InvalidPersonLastNameLengthException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_PERSON_LAST_NAME_LENGTH';
  readonly errorCode = 'PER_VALIDATION_004';

  constructor(lastName: string, minLength: number, maxLength: number) {
    super(`El apellido "${lastName}" debe tener entre ${minLength} y ${maxLength} caracteres.`);
  }
}

export class InvalidPersonEmailLengthException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_PERSON_EMAIL_LENGTH';
  readonly errorCode = 'PER_VALIDATION_005';

  constructor(email: string, minLength: number, maxLength: number) {
    super(
      `El correo electrónico "${email}" debe tener entre ${minLength} y ${maxLength} caracteres.`,
    );
  }
}

export class InvalidPersonEmailFormatException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_PERSON_EMAIL_FORMAT';
  readonly errorCode = 'PER_VALIDATION_006';

  constructor(email: string) {
    super(`El email "${email}" no cumple con el formato esperado.`);
  }
}

export class InvalidPersonPhoneLengthException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_PERSON_PHONE_LENGTH';
  readonly errorCode = 'PER_VALIDATION_007';

  constructor(phone: string, maxLength: number) {
    super(`El teléfono "${phone}" debe tener como máximo ${maxLength} caracteres.`);
  }
}
