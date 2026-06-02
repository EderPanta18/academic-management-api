// modules/courses/application/queries/list-courses.query.ts

interface ListCoursesQueryProps {
  careerId?: number;
  categoryId?: number;
}

export class ListCoursesQuery {
  readonly careerId?: number;
  readonly categoryId?: number;

  constructor(props: ListCoursesQueryProps) {
    this.careerId = props.careerId;
    this.categoryId = props.categoryId;
  }
}
