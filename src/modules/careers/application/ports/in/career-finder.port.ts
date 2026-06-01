// modules/careers/application/ports/in/career-finder.port.ts

export const CAREER_FINDER_PORT = Symbol("CAREER_FINDER_PORT");

export interface ICareerFinder {
  exists(id: number): Promise<boolean>;
}
