// modules/persons/application/services/person-creation-validator.service.ts

import { Inject, Injectable } from "@nestjs/common";

import { Person } from "@modules/persons/domain/entities";
import type { PersonCreationInput, PersonCreationResult } from "../contracts";
import {
  PERSON_REPOSITORY_PORT,
  type IPersonCreationValidator,
  type IPersonRepository
} from "../ports";
import {
  PersonDniAlreadyExistsException,
  PersonEmailAlreadyExistsException
} from "../exceptions";

@Injectable()
export class PersonCreationValidator implements IPersonCreationValidator {
  constructor(
    @Inject(PERSON_REPOSITORY_PORT)
    private readonly repository: IPersonRepository
  ) {}

  async validate(input: PersonCreationInput): Promise<PersonCreationResult> {
    const dniExists = await this.repository.existsByDni(input.dni);

    if (dniExists) throw new PersonDniAlreadyExistsException(input.dni);

    const emailExists = await this.repository.existsByEmail(input.email);

    if (emailExists) throw new PersonEmailAlreadyExistsException(input.email);

    const person = Person.create({
      dni: input.dni,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? undefined,
      birthDate: input.birthDate ?? undefined
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
