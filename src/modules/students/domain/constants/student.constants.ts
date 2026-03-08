// modules/students/domain/constants/student.constants.ts

/**
 * ACTIVE    → Matriculado y operativo. Puede inscribirse en cursos.
 * INACTIVE  → Sin actividad académica actual. No puede inscribirse.
 * GRADUATED → Completó el programa. Registro histórico, sin nuevas inscripciones.
 * SUSPENDED → Suspensión temporal. Bloqueado para inscripciones hasta
 *             que retorne a ACTIVE.
 */
export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  SUSPENDED = 'SUSPENDED',
}
