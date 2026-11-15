// src/modules/persons/infrastructure/persistence/queries/document-type-query.mapper.ts

import type { DocumentTypeReadModel } from '@persons/application/read-models';
import type { DocumentType as DocumentTypeReadRaw } from '@prisma/client';

export class DocumentTypeQueryMapper {
  static toReadModel(raw: DocumentTypeReadRaw): DocumentTypeReadModel {
    return {
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
    };
  }
}
