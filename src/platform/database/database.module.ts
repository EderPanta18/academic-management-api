// src/platform/database/database.module.ts

import { TRANSACTION_MANAGER_TOKEN } from '@core/contracts';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaTransactionService } from './prisma-transaction.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: TRANSACTION_MANAGER_TOKEN,
      useExisting: PrismaTransactionService,
    },
  ],
  exports: [PrismaService, TRANSACTION_MANAGER_TOKEN],
})
export class DatabaseModule {}
