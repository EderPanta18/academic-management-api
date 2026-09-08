// modules/persons/infrastructure/persistence/repositories/person-repository.adapter.ts

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
      },
    });

    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.person.count({
      where: {
        email,
      },
    });

    return count > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.prisma.person.count({
      where: {
        phone,
      },
    });

    return count > 0;
  }

  async isDeleted(id: string): Promise<boolean> {
    const record = await this.prisma.person.findUnique({
      where: { id },
      select: {
        deletedAt: true,
      },
    });

    return !!record?.deletedAt;
  }
}
