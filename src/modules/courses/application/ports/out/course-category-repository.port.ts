export const COURSE_CATEGORY_REPOSITORY_TOKEN = Symbol('COURSE_CATEGORY_REPOSITORY');

export interface ICourseCategoryRepository {
  exists(id: string): Promise<boolean>;
}
