// modules/persons/application/use-cases/create-person.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { CreatePersonProps, Person } from '@modules/persons/domain/entities';
import {
  PersonDniAlreadyExistsException,
  PersonEmailAlreadyExistsException,
} from '@modules/persons/domain/exceptions';
import { type ICreatePersonUseCase } from '@modules/persons/domain/ports/in';
import {
  PERSON_REPOSITORY_PORT,
  type IPersonRepository,
} from '@modules/persons/domain/ports/out';

@Injectable()
export class CreatePersonUseCase implements ICreatePersonUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY_PORT)
    private readonly repository: IPersonRepository,
  ) {}

  async execute(data: CreatePersonProps): Promise<Person> {
    const dniExists = await this.repository.existsByDni(data.dni);
    if (dniExists) throw new PersonDniAlreadyExistsException(data.dni);

    const emailExists = await this.repository.existsByEmail(data.email);
    if (emailExists) throw new PersonEmailAlreadyExistsException(data.email);

    return Person.create(data);
  }
}
