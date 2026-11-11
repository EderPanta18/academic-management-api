// src/platform/database/prisma-transaction.service.ts

import type { ITransactionManager, TransactionOptions } from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaTransactionService implements ITransactionManager {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  async run<T>(operation: () => Promise<T>, options: TransactionOptions = {}): Promise<T> {
    if (this.isActive())
      throw new SystemException(
        'No se permite iniciar una transacción dentro de otra transacción activa.',
      );

    const isolationLevel =
      options.isolation === 'SERIALIZABLE'
        ? Prisma.TransactionIsolationLevel.Serializable
        : Prisma.TransactionIsolationLevel.ReadCommitted;

    const retries = options.retries ?? 0;

    for (let attempt = 0; ; attempt++) {
      try {
        return await this.txHost.withTransaction(
          {
            isolationLevel,
            maxWait: 5000,
            timeout: 10000,
          },
          operation,
        );
      } catch (error) {
        const retryable =
          error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034';

        if (!retryable || attempt >= retries) throw error;
      }
    }
  }

  isActive(): boolean {
    return this.txHost.isTransactionActive();
  }
}
