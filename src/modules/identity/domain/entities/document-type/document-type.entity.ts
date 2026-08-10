import { DOCUMENT_TYPE } from '@identity/domain/constants';
import type { CreateDocumentTypeProps, DocumentTypeProps } from './document-type.types';
import {
  InvalidDocumentTypeCodeFormatException,
  InvalidDocumentTypeCodeLengthException,
  InvalidDocumentTypeDescriptionException,
  InvalidDocumentTypeNameException,
} from './document-type-validation.errors';

export class DocumentType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string | null;

  private constructor(props: DocumentTypeProps) {
    DocumentType.ensureValidCode(props.code);
    DocumentType.ensureValidName(props.name);
    DocumentType.ensureValidDescription(props.description);

    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.description = props.description;

    Object.freeze(this);
  }

  static reconstitute(props: DocumentTypeProps): DocumentType {
    return new DocumentType(props);
  }

  static create(props: CreateDocumentTypeProps): DocumentType {
    return new DocumentType({
      ...props,
      description: props.description ?? null,
    });
  }

  private static ensureValidCode(code: string): void {
    const { pattern, length } = DOCUMENT_TYPE.code;

    if (code.length < length.min || code.length > length.max)
      throw new InvalidDocumentTypeCodeLengthException(code, length.min, length.max);

    if (!pattern.test(code)) throw new InvalidDocumentTypeCodeFormatException(code);
  }

  private static ensureValidName(name: string): void {
    const { length } = DOCUMENT_TYPE.name;

    if (name.length < length.min || name.length > length.max)
      throw new InvalidDocumentTypeNameException(name, length.min, length.max);
  }

  private static ensureValidDescription(description: string | null): void {
    if (description === null) return;

    const { length } = DOCUMENT_TYPE.description;

    if (description.length > length.max)
      throw new InvalidDocumentTypeDescriptionException(description, length.max);
  }
}
