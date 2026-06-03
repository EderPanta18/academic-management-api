// modules/course-offerings/application/commands/create-course-offering.command.ts

interface CreateCourseOfferingCommandProps {
  courseId: number;
  academicPeriodId: number;
  professorId?: number;
  section?: string;
  maxStudents?: number;
  enrollmentDeadline?: Date;
}

export class CreateCourseOfferingCommand {
  readonly courseId: number;
  readonly academicPeriodId: number;
  readonly professorId?: number;
  readonly section?: string;
  readonly maxStudents?: number;
  readonly enrollmentDeadline?: Date;

  constructor(props: CreateCourseOfferingCommandProps) {
    this.courseId = props.courseId;
    this.academicPeriodId = props.academicPeriodId;
    this.professorId = props.professorId;
    this.section = props.section;
    this.maxStudents = props.maxStudents;
    this.enrollmentDeadline = props.enrollmentDeadline;
  }
}
