// modules/enrollments/domain/ports/enrollment.finder.port.ts

/**
 * Contrato reducido de solo-lectura que otros módulos consumen.
 */
export interface IEnrollmentFinder {
  /** Verifica si existe una inscripción activa (no soft-deleted) con ese id. */
  exists(id: number): Promise<boolean>;

  /**
   * Verifica si la inscripción está en estado ENROLLED.
   */
  isEnrolledAndActive(id: number): Promise<boolean>;
}
