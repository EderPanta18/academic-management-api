// enrollment-status.constants.ts

/**
 * ENROLLED  → Inscrito activamente. Puede recibir notas y asistencia.
 * WITHDRAWN → Se retiró formalmente. No puede recibir nuevas notas.
 * COMPLETED → Cerró el ciclo exitosamente. Solo lectura histórica.
 * SUSPENDED → Sanción activa. Bloqueado temporalmente, puede reactivarse.
 */
export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  WITHDRAWN = 'WITHDRAWN',
  COMPLETED = 'COMPLETED',
  SUSPENDED = 'SUSPENDED',
}
