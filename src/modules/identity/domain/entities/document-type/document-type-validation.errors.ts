import { IdentityException } from '@identity/domain/exceptions';

export class InvalidDocumentTypeCodeLengthException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_DOCUMENT_TYPE_CODE_LENGTH';
  readonly errorCode = 'DOC_TYP_VALIDATION_001';

  constructor(code: string, minLength: number, maxLength: number) {
    super(`El código "${code}" debe tener entre ${minLength} y ${maxLength} caracteres.`);
  }
}

export class InvalidDocumentTypeCodeFormatException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_DOCUMENT_TYPE_CODE_FORMAT';
  readonly errorCode = 'DOC_TYP_VALIDATION_002';

  constructor(code: string) {
    super(`El código "${code}" no cumple con el formato esperado.`);
  }
}

export class InvalidDocumentTypeNameException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_DOCUMENT_TYPE_NAME_LENGTH';
  readonly errorCode = 'DOC_TYP_VALIDATION_003';

  constructor(name: string, minLength: number, maxLength: number) {
    super(`El nombre "${name}" debe tener entre ${minLength} y ${maxLength} caracteres.`);
  }
}

export class InvalidDocumentTypeDescriptionException extends IdentityException {
  readonly statusCode = 400;
  readonly errorKey = 'INVALID_DOCUMENT_TYPE_DESCRIPTION_LENGTH';
  readonly errorCode = 'DOC_TYP_VALIDATION_004';

  constructor(description: string, maxLength: number) {
    super(`La descripción "${description}" debe tener como máximo ${maxLength} caracteres.`);
  }
}
