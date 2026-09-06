import type { CreateDocumentTypeProps, DocumentTypeProps } from './document-type.types';

export class DocumentType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string | null;

  private constructor(props: DocumentTypeProps) {
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
}
