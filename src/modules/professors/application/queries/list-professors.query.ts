// modules/professors/application/querys/list-professors.query.ts

export class ListProfessorsQuery {
  readonly departmentId?: number;

  constructor(props: { departmentId?: number }) {
    this.departmentId = props.departmentId;
  }
}
