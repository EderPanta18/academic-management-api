// src/modules/identity/domain/entities/document-type/document-type.types.ts

export type DocumentTypeProps = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

export type CreateDocumentTypeProps = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};
