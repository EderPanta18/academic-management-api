import type { Prisma } from '@prisma/client';
import type { ProfessorCreationData } from '@professors/application/ports/out';
import { Professor, type ProfessorStatus } from '@professors/domain/entities';

type ProfessorRaw = Prisma.ProfessorGetPayload<Record<string, never>>;

type PersonPersistenceData = {
  id: string;
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
};

type ProfessorPersistenceData = {
  id: string;
  personId: string;
  code: string;
  institutionalEmail: string | null;
  department: string | null;
  specialty: string | null;
  status: ProfessorStatus;
};

type ProfessorPersistencePayload = {
  personData: PersonPersistenceData;
  professorData: ProfessorPersistenceData;
};

export class ProfessorRepositoryMapper {
  static toDomain(raw: ProfessorRaw): Professor {
    return Professor.reconstitute({
      id: raw.id,
      personId: raw.personId,
      code: raw.code,
      institutionalEmail: raw.institutionalEmail,
      department: raw.department,
      specialty: raw.specialty,
      status: raw.status as ProfessorStatus,
    });
  }

  static toPersistence(data: ProfessorCreationData): ProfessorPersistencePayload {
    const { professor, personData } = data;

    return {
      personData: {
        id: personData.id,
        documentTypeId: personData.documentTypeId,
        documentNumber: personData.documentNumber,
        firstName: personData.firstName,
        lastName: personData.lastName,
        email: personData.email,
        phone: personData.phone,
        birthDate: personData.birthDate,
      },
      professorData: {
        id: professor.id,
        personId: professor.personId,
        code: professor.code,
        institutionalEmail: professor.institutionalEmail,
        department: professor.department,
        specialty: professor.specialty,
        status: professor.status,
      },
    };
  }
}
