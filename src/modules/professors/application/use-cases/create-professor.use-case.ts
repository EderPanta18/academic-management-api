// modules/professors/application/use-cases/create-professor.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@core/exceptions';
import {
  DEPARTMENT_FINDER_PORT,
  type IDepartmentFinder,
} from '@departments/domain/ports/in';
import {
  CREATE_PERSON_USE_CASE_PORT,
  type ICreatePersonUseCase,
} from '@persons/domain/ports/in';
import { Professor } from '@professors/domain/entities';
import {
  ProfessorCodeAlreadyExistsException,
  ProfessorEmailAlreadyExistsException,
} from '@professors/domain/exceptions';
import {
  PROFESSOR_REPOSITORY_PORT,
  type IProfessorRepository,
} from '@professors/domain/ports/out';
import { CreateProfessorCommand } from '../commands';

@Injectable()
export class CreateProfessorUseCase {
  constructor(
    @Inject(DEPARTMENT_FINDER_PORT)
    private readonly departmentFinder: IDepartmentFinder,

    @Inject(CREATE_PERSON_USE_CASE_PORT)
    private readonly createPerson: ICreatePersonUseCase,

    @Inject(PROFESSOR_REPOSITORY_PORT)
    private readonly repository: IProfessorRepository,
  ) {}

  async execute(command: CreateProfessorCommand): Promise<Professor> {
    if (command.departmentId) {
      const exists = await this.departmentFinder.exists(command.departmentId);
      if (!exists)
        throw new EntityNotFoundException('Department', command.departmentId);
    }

    const codeExists = await this.repository.existsByCode(command.code);
    if (codeExists) throw new ProfessorCodeAlreadyExistsException(command.code);

    if (command.institutionalEmail) {
      const emailExists = await this.repository.existsByInstitutionalEmail(
        command.institutionalEmail,
      );
      if (emailExists)
        throw new ProfessorEmailAlreadyExistsException(
          command.institutionalEmail,
        );
    }

    const person = await this.createPerson.execute({
      dni: command.dni,
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      birthDate: command.birthDate,
    });

    const professor = Professor.create({
      code: command.code,
      departmentId: command.departmentId,
      specialty: command.specialty,
      institutionalEmail: command.institutionalEmail,
      hireDate: command.hireDate,
      status: command.status,
    });

    return this.repository.save(professor, {
      dni: person.dni,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      phone: person.phone,
      birthDate: person.birthDate,
    });
  }
}
