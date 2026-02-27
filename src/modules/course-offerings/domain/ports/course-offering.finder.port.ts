// modules/course-offerings/domain/ports/course-offering.finder.port.ts

/**
 * Contrato reducido de solo-lectura que otros módulos pueden consumir.
 */
export interface ICourseOfferingFinder {
  /**
   * Verifica si existe una oferta activa (no soft-deleted) con ese id.
   */
  exists(id: number): Promise<boolean>;

  /**
   * Verifica si la oferta está en estado ACTIVE y dentro de su
   * enrollmentDeadline.
   */
  isOpenForEnrollment(id: number): Promise<boolean>;
}
