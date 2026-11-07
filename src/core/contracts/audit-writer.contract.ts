// src/core/contracts/audit-writer.contract.ts

export const AUDIT_WRITER_TOKEN = Symbol('AUDIT_WRITER');

export type AuditJsonValue =
  | string
  | number
  | boolean
  | null
  | readonly AuditJsonValue[]
  | { readonly [key: string]: AuditJsonValue };

export type AuditOutcome = 'CONFIRMED' | 'REJECTED' | 'OBSERVED';

export type AuditEntry = Readonly<{
  actorUserId: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  module?: string | null;
  description?: string | null;
  outcome: AuditOutcome;
  metadata?: Readonly<Record<string, AuditJsonValue>>;
  ipAddress?: string | null;
  userAgent?: string | null;
}>;

export type ConfirmedAuditEntry = AuditEntry & {
  outcome: 'CONFIRMED';
};

export interface IAuditWriter {
  /**
   * Registra un cambio confirmado dentro de la transacción activa.
   * Si falla la escritura, la transacción debe revertirse.
   */
  append(entry: ConfirmedAuditEntry): Promise<void>;

  /**
   * Registra evidencia independiente de una modificación funcional,
   * por ejemplo un intento fallido de autenticación.
   */
  appendIndependent(entry: AuditEntry): Promise<void>;
}
