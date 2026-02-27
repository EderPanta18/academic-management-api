// modules/course-offerings/application/commands/assign-professor-to-offering.command.ts

/**
 * Representa la intención de asignar un profesor a una oferta de curso.
 * Solo necesita los dos identificadores involucrados.
 */
export class AssignProfessorToOfferingCommand {
  readonly offeringId: number;
  readonly professorId: number;

  constructor(props: AssignProfessorToOfferingCommand) {
    this.offeringId = props.offeringId;
    this.professorId = props.professorId;
  }
}
