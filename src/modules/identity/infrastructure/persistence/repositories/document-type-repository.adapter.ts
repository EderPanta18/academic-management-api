import type { IDocumentTypeRepository } from '@identity/application/ports/out';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';

@Injectable()
export class DocumentTypeRepository implements IDocumentTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.documentType.count({
      where: {
        id,
        deletedAt: null,
      },
    });

    return count > 0;
  }
}
