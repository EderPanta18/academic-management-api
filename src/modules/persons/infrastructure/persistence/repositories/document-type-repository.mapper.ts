// src/modules/persons/infrastructure/persistence/repositories/document-type-repository.mapper.ts

import type { DocumentType } from '@persons/domain/models';
import type { DocumentType as DocumentTypeRaw } from '@prisma/client';

export class DocumentTypeRepositoryMapper {
  static toDomain(raw: DocumentTypeRaw): DocumentType {
    return {
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
    };
  }
}
