// modules/persons/infrastructure/persistence/mappers/person-persistence.mapper.ts

import { Person, type PersonProps } from '@persons/domain/entities';
import type { Prisma } from '@prisma/client';

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
