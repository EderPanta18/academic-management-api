import { ID_GENERATOR_TOKEN, type IIdGenerator } from '@core/contracts';
import { type IPersonCreationValidator, PERSON_CREATION_VALIDATOR_TOKEN } from '@identity';
import { Inject, Injectable } from '@nestjs/common';
import { Professor } from '@professors/domain/entities';
import type { CreateProfessorCommand } from '../commands';
import {
  ProfessorCodeAlreadyExistsException,
  ProfessorInstitutionalEmailAlreadyExistsException,
} from '../exceptions';
import { type IProfessorRepository, PROFESSOR_REPOSITORY_TOKEN } from '../ports/out';

@Injectable()
export class CreateProfessorUseCase {
  constructor(
    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(PERSON_CREATION_VALIDATOR_TOKEN)
    private readonly personCreationValidator: IPersonCreationValidator,

    @Inject(PROFESSOR_REPOSITORY_TOKEN)
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async execute(command: CreateProfessorCommand): Promise<Professor> {
    const codeAlreadyExists = await this.professorRepository.existsByCode(command.code);

    if (codeAlreadyExists) throw new ProfessorCodeAlreadyExistsException(command.code);

    if (command.institutionalEmail) {
      const emailAlreadyExists = await this.professorRepository.existsByInstitutionalEmail(
        command.institutionalEmail,
      );

      if (emailAlreadyExists)
        throw new ProfessorInstitutionalEmailAlreadyExistsException(command.institutionalEmail);
    }

    await this.personCreationValidator.validate({
      documentTypeId: command.documentTypeId,
      documentNumber: command.documentNumber,
      email: command.email,
      phone: command.phone,
    });

    const professorId = this.idGenerator.generate();
    const personId = this.idGenerator.generate();

    const professor = Professor.create({
      id: professorId,
      personId,
      code: command.code,
      institutionalEmail: command.institutionalEmail,
      department: command.department,
      specialty: command.specialty,
      status: command.status,
    });

    return await this.professorRepository.create({
      professor,
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
