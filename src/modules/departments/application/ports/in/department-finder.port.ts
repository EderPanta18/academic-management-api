// modules/departments/application/ports/in/department-finder.port.ts

export const DEPARTMENT_FINDER_PORT = Symbol('DEPARTMENT_FINDER_PORT');

export interface IDepartmentFinder {
  exists(id: number): Promise<boolean>;
}
