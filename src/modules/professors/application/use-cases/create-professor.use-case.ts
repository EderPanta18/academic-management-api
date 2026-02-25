// modules/professors/application/use-cases/create-professor.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { Professor } from '@professors/domain/entities';
import {
  ProfessorDniAlreadyExistsException,
  ProfessorEmailAlreadyExistsException,
} from '@professors/domain/exceptions';
import {
  PROFESSOR_REPOSITORY_PORT,
  type IProfessorRepository,
} from '@professors/domain/ports';
import { CreateProfessorCommand } from '../commands';

/**
 * Orquesta la creación de un nuevo profesor.
 */
@Injectable()
export class CreateProfessorUseCase {
  constructor(
    @Inject(PROFESSOR_REPOSITORY_PORT)
    private readonly repository: IProfessorRepository,
  ) {}

  async execute(command: CreateProfessorCommand): Promise<Professor> {
    if (await this.repository.existsByDni(command.dni)) {
      throw new ProfessorDniAlreadyExistsException(command.dni);
    }

    if (await this.repository.existsByEmail(command.email)) {
      throw new ProfessorEmailAlreadyExistsException(command.email);
    }

    const professor = Professor.create({
      dni: command.dni,
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      departmentId: command.departmentId,
      specialty: command.specialty,
      hireDate: command.hireDate,
      phone: command.phone,
      birthDate: command.birthDate,
      status: command.status,
    });

    return this.repository.save(professor);
  }
}
