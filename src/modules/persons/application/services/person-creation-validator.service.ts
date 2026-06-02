// modules/persons/application/services/person-creation-validator.service.ts

import { Inject, Injectable } from "@nestjs/common";

import { Person } from "@persons/domain/entities";
import {
  PersonDniAlreadyExistsException,
  PersonEmailAlreadyExistsException
} from "@persons/domain/exceptions";
import type { PersonCreationInput, PersonData } from "../contracts";
import {
  PERSON_REPOSITORY_PORT,
  type IPersonCreationValidator,
  type IPersonRepository
} from "../ports";

@Injectable()
export class PersonCreationValidator implements IPersonCreationValidator {
  constructor(
    @Inject(PERSON_REPOSITORY_PORT)
    private readonly personRepository: IPersonRepository
  ) {}

  async validate(input: PersonCreationInput): Promise<PersonData> {
    const dniExists = await this.personRepository.existsByDni(input.dni);

    if (dniExists) throw new PersonDniAlreadyExistsException(input.dni);

    const emailExists = await this.personRepository.existsByEmail(input.email);

    if (emailExists) throw new PersonEmailAlreadyExistsException(input.email);

    const person = Person.create({
      dni: input.dni,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      birthDate: input.birthDate
    });

    return {
      dni: person.dni,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      phone: person.phone,
      birthDate: person.birthDate
    };
  }
}
