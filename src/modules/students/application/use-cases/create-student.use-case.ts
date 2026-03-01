// modules/students/application/use-cases/create-student.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@shared/domain/exceptions';
import { CAREER_FINDER_PORT, type ICareerFinder } from '@careers/domain/ports';
import { Student } from '@students/domain/entities';
import {
  StudentDuplicateCodeException,
  StudentDniAlreadyExistsException,
  StudentEmailAlreadyExistsException,
} from '@students/domain/exceptions';
import {
  STUDENT_REPOSITORY_PORT,
  type IStudentRepository,
} from '@students/domain/ports';
import { CreateStudentCommand } from '../commands';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(CAREER_FINDER_PORT)
    private readonly careerFinder: ICareerFinder,

    @Inject(STUDENT_REPOSITORY_PORT)
    private readonly repository: IStudentRepository,
  ) {}

  async execute(command: CreateStudentCommand): Promise<Student> {
    const careerExists = await this.careerFinder.exists(command.careerId);
    if (!careerExists) {
      throw new EntityNotFoundException('Career', command.careerId);
    }

    const codeExists = await this.repository.existsByCode(command.code);
    if (codeExists) {
      throw new StudentDuplicateCodeException(command.code);
    }

    const dniExists = await this.repository.existsByDni(command.dni);
    if (dniExists) {
      throw new StudentDniAlreadyExistsException(command.dni);
    }

    const emailExists = await this.repository.existsByEmail(command.email);
    if (emailExists) {
      throw new StudentEmailAlreadyExistsException(command.email);
    }

    const student = Student.create({
      code: command.code,
      dni: command.dni,
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      careerId: command.careerId,
      enrollmentDate: command.enrollmentDate,
      phone: command.phone,
      birthDate: command.birthDate,
      status: command.status,
    });

    return this.repository.save(student);
  }
}
