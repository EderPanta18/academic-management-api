// modules/students/domain/constants/student.constants.ts

/**
 * ACTIVE    → Matriculado y operativo. Puede inscribirse en cursos.
 * INACTIVE  → Sin actividad académica actual. No puede inscribirse.
 * GRADUATED → Completó el programa. Registro histórico, sin nuevas inscripciones.
 * SUSPENDED → Suspensión temporal. Bloqueado para inscripciones hasta
 *             que retorne a ACTIVE.
 *
 * Estos cuatro estados permiten matices que deletedAt (soft-delete) no puede
 * expresar: un estudiante GRADUATED no está dado de baja del sistema,
 * sigue siendo parte del historial académico.
 */
export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  SUSPENDED = 'SUSPENDED',
}
