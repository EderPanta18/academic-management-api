// modules/professors/application/commands/create-professor.command.ts

import { ProfessorStatus } from '@professors/domain/constants';

/**
 * Objeto plano que representa la intención de crear un profesor.
 */
export class CreateProfessorCommand {
  readonly dni: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly departmentId?: number;
  readonly specialty?: string;
  readonly hireDate?: Date;
  readonly phone?: string;
  readonly birthDate?: Date;
  readonly status?: ProfessorStatus;

  constructor(props: CreateProfessorCommand) {
    this.dni = props.dni;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.departmentId = props.departmentId;
    this.specialty = props.specialty;
    this.hireDate = props.hireDate;
    this.phone = props.phone;
    this.birthDate = props.birthDate;
    this.status = props.status;
  }
}
