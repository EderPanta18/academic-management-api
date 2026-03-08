// modules/persons/infrastructure/persistence/mappers/person-persistence.mapper.ts

import { Prisma } from '@prisma/client';
import { Person, type PersonProps } from '@persons/domain/entities';

type PersonRaw = Prisma.PersonGetPayload<Record<string, never>>;

export class PersonPersistenceMapper {
  static toDomain(raw: PersonRaw): Person {
    const props: PersonProps = {
      id: raw.id,
      dni: raw.dni,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      birthDate: raw.birthDate,
    };
    return Person.reconstitute(props);
  }
}
