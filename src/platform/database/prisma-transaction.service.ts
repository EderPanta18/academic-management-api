// src/platform/database/prisma-transaction.service.ts

import type { ITransactionManager, TransactionOptions } from '@core/contracts';
import { TransactionContext } from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

class PrismaTransactionContext extends TransactionContext {
  constructor(readonly client: Prisma.TransactionClient) {
    super();
  }
}

@Injectable()
export class PrismaTransactionService implements ITransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  async run<T>(
    operation: (tx: TransactionContext) => Promise<T>,
    options: TransactionOptions = {},
  ): Promise<T> {
    const isolationLevel =
      options.isolation === 'SERIALIZABLE'
        ? Prisma.TransactionIsolationLevel.Serializable
        : Prisma.TransactionIsolationLevel.ReadCommitted;

    const retries = options.retries ?? 0;

    for (let attempt = 0; ; attempt++)
      try {
        return await this.prisma.$transaction(
          async (client) => {
            const context = new PrismaTransactionContext(client);

            return operation(context);
          },
          {
            isolationLevel,
            maxWait: 5000,
            timeout: 10000,
          },
        );
      } catch (error) {
        const retryable =
          error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034';

        if (!retryable || attempt >= retries) throw error;
      }
  }

  getClient(context: TransactionContext): Prisma.TransactionClient {
    if (!(context instanceof PrismaTransactionContext))
      throw new SystemException('Contexto de transacción de Prisma inválido.');

    return context.client;
  }
}
