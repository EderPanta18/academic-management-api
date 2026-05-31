// modules/course-offerings/application/commands/assign-professor-to-offering.command.ts

/**
 * Representa la intención de asignar un profesor a una oferta de curso.
 */

type AssignProfessorToOfferingCommandProps = {
  offeringId: number;
  professorId: number;
};

export class AssignProfessorToOfferingCommand {
  readonly offeringId: number;
  readonly professorId: number;

  constructor(props: AssignProfessorToOfferingCommandProps) {
    this.offeringId = props.offeringId;
    this.professorId = props.professorId;
  }
}
