import type { AuditEntry, ConfirmedAuditEntry, IAuditWriter } from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaAuditWriterAdapter implements IAuditWriter {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly prisma: PrismaService,
  ) {}

  async append(entry: ConfirmedAuditEntry): Promise<void> {
    if (!this.txHost.isTransactionActive())
      throw new SystemException(
        'La evidencia de una operación confirmada requiere una transacción activa.',
      );

    await this.txHost.tx.auditLog.create({
      data: this.toCreateData(entry),
    });
  }

  async appendIndependent(entry: AuditEntry): Promise<void> {
    if (this.txHost.isTransactionActive())
      throw new SystemException(
        'Los eventos independientes se registran fuera de la transacción de negocio.',
      );

    await this.prisma.auditLog.create({
      data: this.toCreateData(entry),
    });
  }

  private toCreateData(entry: AuditEntry): Prisma.AuditLogUncheckedCreateInput {
    const metadata = {
      ...entry.metadata,
      outcome: entry.outcome,
    } as Prisma.InputJsonObject;

    return {
      actorUserId: entry.actorUserId,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      module: entry.module,
      description: entry.description,
      metadata,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
    };
  }
}
