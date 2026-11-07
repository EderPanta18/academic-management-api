// src/platform/database/database.module.ts

import { AUDIT_WRITER_TOKEN, TRANSACTION_MANAGER_TOKEN } from '@core/contracts';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaAuditWriterAdapter } from './prisma-audit-writer.adapter';
import { PrismaTransactionService } from './prisma-transaction.service';

@Module({
  providers: [
    PrismaService,
    PrismaTransactionService,
    {
      provide: TRANSACTION_MANAGER_TOKEN,
      useExisting: PrismaTransactionService,
    },
    {
      provide: AUDIT_WRITER_TOKEN,
      useClass: PrismaAuditWriterAdapter,
    },
  ],
  exports: [PrismaService, TRANSACTION_MANAGER_TOKEN, AUDIT_WRITER_TOKEN],
})
export class DatabaseModule {}
