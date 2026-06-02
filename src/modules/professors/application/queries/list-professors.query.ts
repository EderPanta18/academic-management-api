// modules/professors/application/queries/list-professors.query.ts

interface ListProfessorsQueryProps {
  departmentId?: number;
}

export class ListProfessorsQuery {
  readonly departmentId?: number;

  constructor(props: ListProfessorsQueryProps = {}) {
    this.departmentId = props.departmentId;
  }
}
