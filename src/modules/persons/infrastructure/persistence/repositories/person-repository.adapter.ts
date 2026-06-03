// modules/persons/infrastructure/persistence/repositories/person-repository.adapter.ts

import { Injectable } from '@nestjs/common';
import type { IPersonRepository } from '@persons/application/ports/out';
import type { PrismaService } from '@platform/database';

@Injectable()
export class PersonRepository implements IPersonRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── IPersonRepository ----─────────────────────────────────────────────────

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
