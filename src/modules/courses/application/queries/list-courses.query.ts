// modules/courses/application/queries/list-courses.query.ts

export class ListCoursesQuery {
  readonly careerId?: number;
  readonly categoryId?: number;

  constructor(props: { careerId?: number; categoryId?: number }) {
    this.careerId = props.careerId;
    this.categoryId = props.categoryId;
  }
}
