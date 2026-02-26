// modules/students/application/use-cases/create-student.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
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
    @Inject(STUDENT_REPOSITORY_PORT)
    private readonly repository: IStudentRepository,
  ) {}

  async execute(command: CreateStudentCommand): Promise<Student> {
    if (await this.repository.existsByCode(command.code)) {
      throw new StudentDuplicateCodeException(command.code);
    }

    if (await this.repository.existsByDni(command.dni)) {
      throw new StudentDniAlreadyExistsException(command.dni);
    }

    if (await this.repository.existsByEmail(command.email)) {
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
