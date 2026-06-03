// modules/persons/infrastructure/persistence/mappers/person-persistence.mapper.ts

import { Person } from '@persons/domain/entities';
import { Prisma } from '@prisma/client';

type PersonRaw = Prisma.PersonGetPayload<Record<string, never>>;

export class PersonPersistenceMapper {
  static toDomain(raw: PersonRaw): Person {
    return Person.reconstitute({
      id: raw.id,
      dni: raw.dni,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      birthDate: raw.birthDate,
    });
  }
}
