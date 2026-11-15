// src/modules/persons/infrastructure/persistence/repositories/person-repository.mapper.ts

import { Person } from '@persons/domain/entities';
import type { Person as PersonRaw } from '@prisma/client';

export class PersonRepositoryMapper {
  static toDomain(raw: PersonRaw): Person {
    return Person.reconstitute({
      id: raw.id,
      documentTypeId: raw.documentTypeId,
      documentNumber: raw.documentNumber,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      birthDate: raw.birthDate,
    });
  }
}
