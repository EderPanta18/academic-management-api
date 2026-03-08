// modules/courses/domain/ports/in/course.finder.port.ts

export interface ICourseFinder {
  /**
   * Verifica si existe un cursos (no soft-deleted) con ese id.
   */
  exists(id: number): Promise<boolean>;
}
