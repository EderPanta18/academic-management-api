// modules/courses/domain/entities/course.entity.ts

import type { CourseProps, CreateCourseProps } from './course.types';

type InternalProps = {
  id?: number;
  careerId: number;
  categoryId?: number | null;
  name: string;
  description?: string | null;
  credits: number;
};

export class Course {
  readonly id?: number;
  readonly careerId: number;
  readonly categoryId: number | null;
  readonly name: string;
  readonly description: string | null;
  readonly credits: number;

  private constructor(props: InternalProps) {
    this.id = props.id;
    this.careerId = props.careerId;
    this.categoryId = props.categoryId ?? null;
    this.name = props.name;
    this.description = props.description ?? null;
    this.credits = props.credits;
    Object.freeze(this);
  }

  static create(props: CreateCourseProps): Course {
    return new Course(props);
  }

  static reconstitute(props: CourseProps): Course {
    return new Course(props);
  }
}
