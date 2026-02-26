// modules/students/domain/ports/student.finder.port.ts

/**
 * Contrato reducido expuesto hacia otros módulos.
 */
export interface IStudentFinder {
  /**
   * Verifica si existe un estudiante activo (no eliminado) con ese id.
   */
  exists(id: number): Promise<boolean>;
}
