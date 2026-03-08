// modules/departments/domain/ports/in/department.finder.port.ts

export interface IDepartmentFinder {
  /**
   * Verifica si existe un departamento activo (no soft-deleted) con ese id.
   */
  exists(id: number): Promise<boolean>;
}
