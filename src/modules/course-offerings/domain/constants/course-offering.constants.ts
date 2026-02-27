// modules/course-offerings/domain/constants/course-offering.constants.ts

/**
 * INACTIVE  → Creada pero aún no disponible para inscripciones.
 * ACTIVE    → Vigente. Acepta inscripciones (respetando enrollmentDeadline).
 * CANCELLED → No se dictará. Libera cupos y bloquea nuevas inscripciones.
 * COMPLETED → Ciclo cerrado. Solo lectura histórica, sin nuevas notas ni inscripciones.
 *
 * Solo ACTIVE puede recibir un profesor asignado y aceptar inscripciones.
 */
export enum CourseOfferingStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
