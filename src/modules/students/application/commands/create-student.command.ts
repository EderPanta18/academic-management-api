// modules/students/application/commands/create-student.command.ts

import { StudentStatus } from '@students/domain/constants';

interface CreateStudentCommandProps {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  careerId: number;
  code: string;
  enrollmentDate: Date;
  institutionalEmail?: string;
  status?: StudentStatus;
  phone?: string;
  birthDate?: Date;
}

export class CreateStudentCommand {
  readonly dni: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly careerId: number;
  readonly code: string;
  readonly enrollmentDate: Date;
  readonly institutionalEmail?: string;
  readonly status?: StudentStatus;
  readonly phone?: string;
  readonly birthDate?: Date;

  constructor(props: CreateStudentCommandProps) {
    this.dni = props.dni;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.careerId = props.careerId;
    this.code = props.code;
    this.institutionalEmail = props.institutionalEmail;
    this.enrollmentDate = props.enrollmentDate;
    this.status = props.status;
    this.phone = props.phone;
    this.birthDate = props.birthDate;
  }
}
