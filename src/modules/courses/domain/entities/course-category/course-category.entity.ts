import type { CourseCategoryProps, CreateCourseCategoryProps } from './course-category.types';

export class CourseCategory {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string | null;

  private constructor(props: CourseCategoryProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.description = props.description;

    Object.freeze(this);
  }

  static reconstitute(props: CourseCategoryProps): CourseCategory {
    return new CourseCategory(props);
  }

  static create(props: CreateCourseCategoryProps): CourseCategory {
    return new CourseCategory(props);
  }
}
