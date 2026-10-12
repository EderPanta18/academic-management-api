import {
  ACADEMIC_PROGRAM_CHECKER_TOKEN,
  type IAcademicProgramChecker,
} from '@academic-programs/application/ports/in';
import { ID_GENERATOR_TOKEN, type IIdGenerator } from '@core/contracts';
import { type IPersonCreationValidator, PERSON_CREATION_VALIDATOR_TOKEN } from '@identity';
import { Inject, Injectable } from '@nestjs/common';
import {
  StudentAcademicProgramNotFoundException,
  StudentCodeAlreadyExistsException,
  StudentInstitutionalEmailAlreadyExistsException,
} from '@students/application/exceptions';
import { type IStudentRepository, STUDENT_REPOSITORY_TOKEN } from '@students/application/ports/out';
import { Student } from '@students/domain/entities';
import type { CreateStudentCommand } from '../commands';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(ACADEMIC_PROGRAM_CHECKER_TOKEN)
    private readonly academicProgramChecker: IAcademicProgramChecker,

    @Inject(PERSON_CREATION_VALIDATOR_TOKEN)
    private readonly personCreationValidator: IPersonCreationValidator,

    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(STUDENT_REPOSITORY_TOKEN)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute(command: CreateStudentCommand): Promise<Student> {
    const academicProgramExists = await this.academicProgramChecker.exists(
      command.academicProgramId,
    );

    if (!academicProgramExists)
      throw new StudentAcademicProgramNotFoundException(command.academicProgramId);

    const codeAlreadyExists = await this.studentRepository.existsByCode(command.code);

    if (codeAlreadyExists) throw new StudentCodeAlreadyExistsException(command.code);

    if (command.institutionalEmail) {
      const emailAlreadyExists = await this.studentRepository.existsByInstitutionalEmail(
        command.institutionalEmail,
      );

      if (emailAlreadyExists)
        throw new StudentInstitutionalEmailAlreadyExistsException(command.institutionalEmail);
    }

    await this.personCreationValidator.validate({
      documentTypeId: command.documentTypeId,
      documentNumber: command.documentNumber,
      email: command.email,
      phone: command.phone,
    });

    const studentId = this.idGenerator.generate();
    const personId = this.idGenerator.generate();

    const student = Student.create({
      id: studentId,
      personId,
      academicProgramId: command.academicProgramId,
      code: command.code,
      institutionalEmail: command.institutionalEmail,
      admissionPeriod: command.admissionPeriod,
      status: command.status,
    });

    return await this.studentRepository.create({
      student,
      personData: {
        id: personId,
        documentTypeId: command.documentTypeId,
        documentNumber: command.documentNumber,
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        phone: command.phone,
        birthDate: command.birthDate,
      },
    });
  }
}
