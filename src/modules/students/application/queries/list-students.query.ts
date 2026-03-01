// modules/students/application/queries/list-students.query.ts

export class ListStudentsQuery {
  readonly careerId?: number;

  constructor(props: { careerId?: number }) {
    this.careerId = props.careerId;
  }
}
