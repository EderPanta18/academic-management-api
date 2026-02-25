// modules/professors/domain/constants/professor.constants.ts

/**
 *
 * ACTIVE   → Operativo. Puede ser asignado a nuevas ofertas de curso.
 * INACTIVE → Sin actividad actual. No puede recibir nuevas asignaciones.
 * ON_LEAVE → En licencia temporal. Existe en el sistema pero está bloqueado
 *            para nuevas asignaciones hasta que retorne a ACTIVE.
 *
 * Estos tres estados permiten matices que deletedAt (soft-delete) no puede
 * expresar: un profesor ON_LEAVE no está dado de baja, sigue siendo parte
 * de la institución, pero tampoco puede dictar cursos nuevos.
 */
export enum ProfessorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
}
