// modules/students/application/use-cases/create-student.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@shared/domain/exceptions';
import {
  CAREER_FINDER_PORT,
  type ICareerFinder,
} from '@careers/domain/ports/in';
import {
  CREATE_PERSON_USE_CASE_PORT,
  type ICreatePersonUseCase,
} from '@persons/domain/ports/in';
import { Student } from '@students/domain/entities';
import { StudentCodeAlreadyExistsException } from '@students/domain/exceptions';
import {
  STUDENT_REPOSITORY_PORT,
  type IStudentRepository,
} from '@students/domain/ports/out';
import { CreateStudentCommand } from '../commands';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(CAREER_FINDER_PORT)
    private readonly careerFinder: ICareerFinder,

    @Inject(CREATE_PERSON_USE_CASE_PORT)
    private readonly createPerson: ICreatePersonUseCase,

    @Inject(STUDENT_REPOSITORY_PORT)
    private readonly repository: IStudentRepository,
  ) {}

  async execute(command: CreateStudentCommand): Promise<Student> {
    const careerExists = await this.careerFinder.exists(command.careerId);
    if (!careerExists)
      throw new EntityNotFoundException('Career', command.careerId);

    const codeExists = await this.repository.existsByCode(command.code);
    if (codeExists) throw new StudentCodeAlreadyExistsException(command.code);

    const person = await this.createPerson.execute({
      dni: command.dni,
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      birthDate: command.birthDate,
    });

    const student = Student.create({
      careerId: command.careerId,
      code: command.code,
      enrollmentDate: command.enrollmentDate,
      institutionalEmail: command.institutionalEmail,
      status: command.status,
    });

    return this.repository.save(student, {
      dni: person.dni,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      phone: person.phone,
      birthDate: person.birthDate,
    });
  }
}
