// src/modules/persons/infrastructure/persistence/repositories/person-repository.adapter.ts

import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import type { IPersonRepository } from '@persons/application/ports/out';
import type { Person } from '@persons/domain/entities';
import { PrismaService } from '@platform/database';
import { Prisma } from '@prisma/client';
import { PersonRepositoryMapper } from './person-repository.mapper';

@Injectable()
export class PersonRepositoryAdapter implements IPersonRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async create(person: Person): Promise<void> {
    this.assertTransactionActive();

    await this.txHost.tx.person.create({
      data: {
        id: person.id,
        documentTypeId: person.documentTypeId,
        documentNumber: person.documentNumber,
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        phone: person.phone,
        birthDate: person.birthDate,
      },
    });
  }

  async update(person: Person): Promise<void> {
    this.assertTransactionActive();

    await this.txHost.tx.person.update({
      where: {
        id: person.id,
        deletedAt: null,
      },
      data: {
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        phone: person.phone,
        birthDate: person.birthDate,
      },
    });
  }

  async find(id: string): Promise<Person | null> {
    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raw = await db.person.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return raw ? PersonRepositoryMapper.toDomain(raw) : null;
  }

  async exists(id: string): Promise<boolean> {
    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raw = await db.person.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    return raw !== null;
  }

  async existsByDocument(documentTypeId: string, documentNumber: string): Promise<boolean> {
    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raw = await db.person.findFirst({
      where: {
        documentTypeId,
        documentNumber,
      },
      select: {
        id: true,
      },
    });

    return raw !== null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const result = await db.$queryRaw<{ exists: boolean }[]>(Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM "persons"
        WHERE "deletedAt" IS NULL
          AND lower(btrim("email")) = lower(btrim(${email}))
      ) AS "exists"
    `);

    return result[0]?.exists ?? false;
  }

  private assertTransactionActive(): void {
    if (!this.txHost.isTransactionActive())
      throw new SystemException('La modificación de personas requiere una transacción activa.');
  }
}
