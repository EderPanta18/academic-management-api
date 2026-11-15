// src/modules/persons/domain/models/document-type.model.ts

export type DocumentType = Readonly<{
  id: string;
  code: string;
  name: string;
  description: string | null;
}>;
