// modules/professors/application/use-cases/create-professor.use-case.ts

import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@core/exceptions";
import {
  DEPARTMENT_FINDER_PORT,
  type IDepartmentFinder
} from "@departments/application/ports/in";
import {
  PERSON_CREATION_VALIDATOR_PORT,
  type IPersonCreationValidator
} from "@persons/application/ports/in";
import { Professor } from "@professors/domain/entities";
import {
  PROFESSOR_REPOSITORY_PORT,
  type IProfessorRepository
} from "@professors/application/ports/out";
import {
  ProfessorCodeAlreadyExistsException,
  ProfessorEmailAlreadyExistsException
} from "@professors/domain/exceptions";
import { CreateProfessorCommand } from "../commands";

@Injectable()
export class CreateProfessorUseCase {
  constructor(
    @Inject(DEPARTMENT_FINDER_PORT)
    private readonly departmentFinder: IDepartmentFinder,

    @Inject(PERSON_CREATION_VALIDATOR_PORT)
    private readonly personCreationValidator: IPersonCreationValidator,

    @Inject(PROFESSOR_REPOSITORY_PORT)
    private readonly professorRepository: IProfessorRepository
  ) {}

  async execute(command: CreateProfessorCommand): Promise<Professor> {
    if (command.departmentId) {
      const exists = await this.departmentFinder.exists(command.departmentId);

      if (!exists)
        throw new EntityNotFoundException("Department", command.departmentId);
    }

    const codeExists = await this.professorRepository.existsByCode(
      command.code
    );

    if (codeExists) throw new ProfessorCodeAlreadyExistsException(command.code);

    if (command.institutionalEmail) {
      const emailExists =
        await this.professorRepository.existsByInstitutionalEmail(
          command.institutionalEmail
        );

      if (emailExists)
        throw new ProfessorEmailAlreadyExistsException(
          command.institutionalEmail
        );
    }

    const personData = await this.personCreationValidator.validate({
      dni: command.dni,
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      birthDate: command.birthDate
    });

    const professor = Professor.create({
      code: command.code,
      departmentId: command.departmentId,
      specialty: command.specialty,
      institutionalEmail: command.institutionalEmail,
      hireDate: command.hireDate,
      status: command.status
    });

    return this.professorRepository.save({
      professor,
      personData
    });
  }
}
