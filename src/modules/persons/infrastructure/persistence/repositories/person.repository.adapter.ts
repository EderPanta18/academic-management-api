// modules/persons/infrastructure/persistence/repositories/person.prisma.repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import { type IPersonRepository } from '@persons/domain/ports/out';

@Injectable()
export class PersonRepository implements IPersonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByDni(dni: string): Promise<boolean> {
    const count = await this.prisma.person.count({
      where: { dni, deletedAt: null },
    });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.person.count({
      where: { email, deletedAt: null },
    });
    return count > 0;
  }
}
