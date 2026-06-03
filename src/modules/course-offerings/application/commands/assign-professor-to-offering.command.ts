// modules/course-offerings/application/commands/assign-professor-to-offering.command.ts

interface AssignProfessorToOfferingCommandProps {
  offeringId: number;
  professorId: number;
}

export class AssignProfessorToOfferingCommand {
  readonly offeringId: number;
  readonly professorId: number;

  constructor(props: AssignProfessorToOfferingCommandProps) {
    this.offeringId = props.offeringId;
    this.professorId = props.professorId;
  }
}
