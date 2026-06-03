// modules/professors/application/ports/in/professor-finder.port.ts

export const PROFESSOR_FINDER_PORT = Symbol('PROFESSOR_FINDER_PORT');

export interface IProfessorFinder {
  exists(id: number): Promise<boolean>;

  isActive(id: number): Promise<boolean>;
}
