// modules/careers/domain/ports/in/career.finder.port.ts

export interface ICareerFinder {
  /**
   * Verifica si existe una carrera activa (no soft-deleted) con ese id.
   */
  exists(id: number): Promise<boolean>;
}
