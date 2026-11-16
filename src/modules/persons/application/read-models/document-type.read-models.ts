// src/modules/persons/application/read-models/document-type.read-models.ts

export type DocumentTypeReadModel = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};
