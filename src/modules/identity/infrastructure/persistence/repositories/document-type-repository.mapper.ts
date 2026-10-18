import { DocumentType } from '@identity/domain/entities';
import type { Prisma } from '@prisma/client';

type DocumentTypeRaw = Prisma.DocumentTypeGetPayload<Record<string, never>>;

export class DocumentTypeRepositoryMapper {
  static toDomain(raw: DocumentTypeRaw): DocumentType {
    return DocumentType.reconstitute({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
    });
  }
}
