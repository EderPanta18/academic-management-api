import type { Prisma } from '@prisma/client';
import type { StudentReadModel } from '@students/application/read-models';
import type { StudentStatus } from '@students/domain/entities';

export type StudentReadRaw = Prisma.StudentGetPayload<{
  include: {
    person: {
      include: {
        documentType: true;
      };
    };
  };
}>;

export class StudentQueryMapper {
  static toReadModel(raw: StudentReadRaw): StudentReadModel {
    return {
      id: raw.id,
      personId: raw.personId,
      academicProgramId: raw.academicProgramId,
      code: raw.code,
      institutionalEmail: raw.institutionalEmail,
      admissionPeriod: raw.admissionPeriod,
      status: raw.status as StudentStatus,
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
