// src/modules/persons/infrastructure/persistence/queries/person-query.adapter.ts

import type { PaginationVO } from '@core/pagination';
import { Injectable } from '@nestjs/common';
import type { IPersonQuery, PersonQueryFilters } from '@persons/application/ports/out';
import type { PersonReadModel } from '@persons/application/read-models';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import { PersonQueryMapper } from './person-query.mapper';

@Injectable()
export class PersonQueryAdapter implements IPersonQuery {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: string): Promise<PersonReadModel | null> {
    const raw = await this.prisma.person.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        documentType: true,
      },
    });

    return raw ? PersonQueryMapper.toReadModel(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: PersonQueryFilters,
  ): Promise<[PersonReadModel[], number]> {
    const where: Prisma.PersonWhereInput = {
      deletedAt: null,
      documentTypeId: filters?.documentTypeId,
      ...(filters?.search && {
        OR: [
          { documentNumber: { contains: filters.search, mode: 'insensitive' } },
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.person.findMany({
        where,
        include: {
          documentType: true,
        },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      }),

      this.prisma.person.count({ where }),
    ]);

    return [raws.map(PersonQueryMapper.toReadModel), total];
  }
}
