// src/modules/identity/infrastructure/persistence/repositories/person-repository.adapter.ts

import type { IPersonRepository } from '@identity/application/ports/out';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';

@Injectable()
export class PersonRepository implements IPersonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByDocumentTypeIdAndNumber(
    documentTypeId: string,
    documentNumber: string,
  ): Promise<boolean> {
    const count = await this.prisma.person.count({
      where: {
        documentTypeId,
        documentNumber,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.person.count({
      where: {
        email,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.prisma.person.count({
      where: {
        phone,
        deletedAt: null,
      },
    });

    return count > 0;
  }
}
