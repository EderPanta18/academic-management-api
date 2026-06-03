// modules/enrollments/application/commands/enroll-student.command.ts

interface EnrollStudentCommandProps {
  studentId: number;
  courseOfferingId: number;
  enrollmentDate: Date;
  createdBy?: number;
}

export class EnrollStudentCommand {
  readonly studentId: number;
  readonly courseOfferingId: number;
  readonly enrollmentDate: Date;
  readonly createdBy?: number;

  constructor(props: EnrollStudentCommandProps) {
    this.studentId = props.studentId;
    this.courseOfferingId = props.courseOfferingId;
    this.enrollmentDate = props.enrollmentDate;
    this.createdBy = props.createdBy;
  }
}
