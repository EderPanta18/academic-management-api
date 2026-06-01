// modules/course-categories/application/ports/in/course-category.finder.port.ts

export const COURSE_CATEGORY_FINDER_PORT = Symbol(
  "COURSE_CATEGORY_FINDER_PORT"
);

export interface ICourseCategoryFinder {
  exists(id: number): Promise<boolean>;
}
