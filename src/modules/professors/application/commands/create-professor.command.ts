// modules/professors/application/commands/create-professor.command.ts

import type { ProfessorStatus } from '@professors/domain/constants';

interface CreateProfessorCommandProps {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId?: number;
  code: string;
  specialty?: string;
  institutionalEmail?: string;
  hireDate?: Date;
  phone?: string;
  birthDate?: Date;
  status?: ProfessorStatus;
}

export class CreateProfessorCommand {
  readonly dni: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly code: string;
  readonly departmentId?: number;
  readonly specialty?: string;
  readonly institutionalEmail?: string;
  readonly hireDate?: Date;
  readonly phone?: string;
  readonly birthDate?: Date;
  readonly status?: ProfessorStatus;

  constructor(props: CreateProfessorCommandProps) {
    this.dni = props.dni;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.code = props.code;
    this.departmentId = props.departmentId;
    this.specialty = props.specialty;
    this.institutionalEmail = props.institutionalEmail;
    this.hireDate = props.hireDate;
    this.phone = props.phone;
    this.birthDate = props.birthDate;
    this.status = props.status;
  }
}
