import type { Prisma } from '@prisma/client';
import type { ProfessorReadModel } from '@professors/application/read-models';
import type { ProfessorStatus } from '@professors/domain/entities';

export type ProfessorReadRaw = Prisma.ProfessorGetPayload<{
  include: {
    person: {
      include: {
        documentType: true;
      };
    };
  };
}>;

export class ProfessorQueryMapper {
  static toReadModel(raw: ProfessorReadRaw): ProfessorReadModel {
    return {
      id: raw.id,
      personId: raw.personId,
      code: raw.code,
      institutionalEmail: raw.institutionalEmail,
      department: raw.department,
      specialty: raw.specialty,
      status: raw.status as ProfessorStatus,
      documentTypeName: raw.person.documentType.name,
      documentNumber: raw.person.documentNumber,
      firstName: raw.person.firstName,
      lastName: raw.person.lastName,
      email: raw.person.email,
      phone: raw.person.phone,
      birthDate: raw.person.birthDate,
    };
  }
}
