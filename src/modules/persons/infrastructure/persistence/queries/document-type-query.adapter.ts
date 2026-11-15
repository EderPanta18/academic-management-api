// src/modules/persons/infrastructure/persistence/queries/document-type-query.adapter.ts

import { Injectable } from '@nestjs/common';
import type { IDocumentTypeQuery } from '@persons/application/ports/out';
import type { DocumentTypeReadModel } from '@persons/application/read-models';
import { PrismaService } from '@platform/database';
import { DocumentTypeQueryMapper } from './document-type-query.mapper';

@Injectable()
export class DocumentTypeQueryAdapter implements IDocumentTypeQuery {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DocumentTypeReadModel[]> {
    const raws = await this.prisma.documentType.findMany({
      orderBy: [{ code: 'asc' }],
    });

    return raws.map(DocumentTypeQueryMapper.toReadModel);
  }
}
