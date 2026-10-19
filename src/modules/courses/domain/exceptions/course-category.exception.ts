import { CourseException } from './course.exception';

export abstract class CourseCategoryException extends CourseException {
  override readonly entity = 'course_category';
}
