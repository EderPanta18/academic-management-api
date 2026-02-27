// modules/courses/domain/ports/course.finder.port.ts

/**
 * Contrato reducido de solo-lectura que otros módulos pueden consumir.
 */
export interface ICourseFinder {
  /**
   * Verifica si existe un cursos (no soft-deleted) con ese id.
   */
  exists(id: number): Promise<boolean>;
}
