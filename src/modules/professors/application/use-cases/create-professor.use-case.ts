// modules/professors/application/use-cases/create-professor.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@shared/domain/exceptions';
import {
  DEPARTMENT_FINDER_PORT,
  type IDepartmentFinder,
} from '@departments/domain/ports';
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
    @Inject(DEPARTMENT_FINDER_PORT)
    private readonly departmentFinder: IDepartmentFinder,

    @Inject(PROFESSOR_REPOSITORY_PORT)
    private readonly repository: IProfessorRepository,
  ) {}

  async execute(command: CreateProfessorCommand): Promise<Professor> {
    if (command.departmentId) {
      const departmentExists = await this.departmentFinder.exists(
        command.departmentId,
      );
      if (!departmentExists) {
        throw new EntityNotFoundException('Department', command.departmentId);
      }
    }

    const dniExists = await this.repository.existsByDni(command.dni);
    if (dniExists) {
      throw new ProfessorDniAlreadyExistsException(command.dni);
    }

    const emailExists = await this.repository.existsByEmail(command.email);
    if (emailExists) {
      throw new ProfessorEmailAlreadyExistsException(command.email);
    }

    const professor = Professor.create({
      dni: command.dni,
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      departmentId: command.departmentId,
      code: command.code,
      specialty: command.specialty,
      hireDate: command.hireDate,
      phone: command.phone,
      birthDate: command.birthDate,
      status: command.status,
    });

    return this.repository.save(professor);
  }
}
