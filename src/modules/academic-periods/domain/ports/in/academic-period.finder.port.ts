// modules/academic-periods/domain/ports/in/academic-period.finder.port.ts

export interface IAcademicPeriodFinder {
  /**
   * Verifica si existe un periodo académico (no soft-deleted) con ese id.
   */
  exists(id: number): Promise<boolean>;

  /**
   * Verifica si el período existe Y tiene isCurrent = true.
   * Usado antes de crear una oferta de curso.
   */
  isCurrent(id: number): Promise<boolean>;
}
