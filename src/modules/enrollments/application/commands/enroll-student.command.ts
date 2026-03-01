// modules/enrollments/application/commands/enroll-student.command.ts

/**
 * Representa la intención de inscribir un alumno en una oferta de curso.
 * createdBy es el id del appuser que procesa la matrícula.
 * NULL cuando el alumno se inscribe por autoservicio.
 */
export class EnrollStudentCommand {
  readonly studentId: number;
  readonly courseOfferingId: number;
  readonly enrollmentDate: Date;
  readonly createdBy?: number;

  constructor(props: EnrollStudentCommand) {
    this.studentId = props.studentId;
    this.courseOfferingId = props.courseOfferingId;
    this.enrollmentDate = props.enrollmentDate;
    this.createdBy = props.createdBy;
  }
}
