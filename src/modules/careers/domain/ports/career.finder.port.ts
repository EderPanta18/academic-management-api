// modules/careers/domain/ports/career.finder.port.ts

/**
 * Contrato reducido de solo-lectura.
 */
export interface ICareerFinder {
  /**
   * Verifica si existe una carrera activa (no soft-deleted) con ese id.
   */
  exists(id: number): Promise<boolean>;
}
