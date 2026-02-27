// modules/professors/domain/ports/professor.finder.port.ts

/**
 * Es el ÚNICO contrato que otros módulos pueden consumir de professors.
 * Expone exclusivamente operaciones de lectura segura sin acceso
 * a ninguna operación de escritura del repositorio.
 */
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
