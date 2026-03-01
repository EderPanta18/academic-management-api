// modules/course-offerings/application/commands/create-course-offering.command.ts

/**
 * Representa la intención de crear una nueva oferta de curso.
 * courseId y academicPeriodId son obligatorios — definen la oferta.
 */
export class CreateCourseOfferingCommand {
  readonly courseId: number;
  readonly academicPeriodId: number;
  readonly professorId?: number;
  readonly section?: string;
  readonly maxStudents?: number;
  readonly enrollmentDeadline?: Date;

  constructor(props: CreateCourseOfferingCommand) {
    this.courseId = props.courseId;
    this.academicPeriodId = props.academicPeriodId;
    this.professorId = props.professorId;
    this.section = props.section;
    this.maxStudents = props.maxStudents;
    this.enrollmentDeadline = props.enrollmentDeadline;
  }
}
