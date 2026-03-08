// modules/professors/domain/ports/in/professor.finder.port.ts

export interface IProfessorFinder {
  /**
   * Verifica si existe un profesor activo (no eliminado) con ese id.
   */
  exists(id: number): Promise<boolean>;

  /**
   * Verifica si el profesor existe Y su status es ACTIVE.
   */
  isActive(id: number): Promise<boolean>;
}
