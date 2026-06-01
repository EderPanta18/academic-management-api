// modules/academic-periods/application/ports/in/academic-period-finder.port.ts

export const ACADEMIC_PERIOD_FINDER_PORT = Symbol(
  "ACADEMIC_PERIOD_FINDER_PORT"
);

export interface IAcademicPeriodFinder {
  exists(id: number): Promise<boolean>;

  isCurrent(id: number): Promise<boolean>;
}
