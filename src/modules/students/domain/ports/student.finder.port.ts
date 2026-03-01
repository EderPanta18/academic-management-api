// modules/students/domain/ports/student.finder.port.ts

/**
 * Contrato reducido expuesto hacia otros módulos.
 */
export interface IStudentFinder {
  /** Verifica si existe un estudiante (no soft-deleted) con ese id. */
  exists(id: number): Promise<boolean>;

  /**
   * Verifica si el estudiante existe Y tiene status ACTIVE.
   */
  isActive(id: number): Promise<boolean>;

  /**
   * Retorna el careerId del estudiante.
   * Null si no existe o fue soft-deleted.
   */
  getCareerIdByStudentId(studentId: number): Promise<number | null>;
}
