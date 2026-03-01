// modules/departments/domain/ports/department.finder.port.ts

/**
 * Contrato reducido de solo-lectura expuesto hacia otros módulos.
 */
export interface IDepartmentFinder {
  /**
   * Verifica si existe un departamento activo (no soft-deleted) con ese id.
   */
  exists(id: number): Promise<boolean>;
}
