// src/modules/persons/infrastructure/persistence/queries/person-query.mapper.ts

import type { PersonReadModel } from '@persons/application/read-models';
import type { Prisma } from '@prisma/client';

export type PersonReadRaw = Prisma.PersonGetPayload<{
  include: {
    documentType: true;
  };
}>;

export class PersonQueryMapper {
  static toReadModel(raw: PersonReadRaw): PersonReadModel {
    return {
      id: raw.id,
      documentTypeCode: raw.documentType.code,
      documentTypeName: raw.documentType.name,
      documentNumber: raw.documentNumber,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      birthDate: raw.birthDate,
    };
  }
}
