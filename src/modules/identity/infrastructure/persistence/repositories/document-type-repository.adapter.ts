// src/modules/identity/infrastructure/persistence/repositories/document-type-repository.adapter.ts

import type { IDocumentTypeRepository } from '@identity/application/ports/out';
import type { DocumentType } from '@identity/domain/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import { DocumentTypeRepositoryMapper } from './document-type-repository.mapper';

@Injectable()
export class DocumentTypeRepository implements IDocumentTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.documentType.count({ where: { id } });

    return count > 0;
  }

  async findByCode(code: string): Promise<DocumentType | null> {
    const raw = await this.prisma.documentType.findFirst({ where: { code } });

    return raw ? DocumentTypeRepositoryMapper.toDomain(raw) : null;
  }
}
