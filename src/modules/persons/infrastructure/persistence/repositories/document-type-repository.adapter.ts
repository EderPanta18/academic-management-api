// src/modules/persons/infrastructure/persistence/repositories/document-type-repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import type { IDocumentTypeRepository } from '@persons/application/ports/out';
import type { DocumentType } from '@persons/domain/models';
import { PrismaService } from '@platform/database';
import { DocumentTypeRepositoryMapper } from './document-type-repository.mapper';

@Injectable()
export class DocumentTypeRepositoryAdapter implements IDocumentTypeRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async exists(id: string): Promise<boolean> {
    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raw = await db.documentType.findUnique({
      where: { id },
      select: { id: true },
    });

    return raw !== null;
  }

  async findByCode(code: string): Promise<DocumentType | null> {
    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raw = await db.documentType.findFirst({
      where: { code },
    });

    return raw ? DocumentTypeRepositoryMapper.toDomain(raw) : null;
  }
}
