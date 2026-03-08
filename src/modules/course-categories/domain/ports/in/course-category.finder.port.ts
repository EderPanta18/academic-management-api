// modules/course-categories/domain/ports/in/course-category.finder.port.ts

export interface ICourseCategoryFinder {
  /**
   * Verifica si existe una categoría no soft-deleted con ese id.
   */
  exists(id: number): Promise<boolean>;
}
