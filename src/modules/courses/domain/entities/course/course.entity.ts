import type { CourseProps, CreateCourseProps } from './course.types';

export class Course {
  readonly id: string;
  readonly academicProgramId: string;
  readonly courseCategoryId: string | null;
  readonly code: string;
  readonly name: string;
  readonly description: string | null;
  readonly credits: number;
  readonly hours: number | null;

  private constructor(props: CourseProps) {
    this.id = props.id;
    this.academicProgramId = props.academicProgramId;
    this.courseCategoryId = props.courseCategoryId;
    this.code = props.code;
    this.name = props.name;
    this.description = props.description;
    this.credits = props.credits;
    this.hours = props.hours;

    Object.freeze(this);
  }

  static reconstitute(props: CourseProps): Course {
    return new Course(props);
  }

  static create(props: CreateCourseProps): Course {
    return new Course(props);
  }

  hasCategory(): boolean {
    return this.courseCategoryId !== null;
  }

  hasHours(): boolean {
    return this.hours !== null;
  }
}
