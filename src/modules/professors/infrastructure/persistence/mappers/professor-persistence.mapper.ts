// modules/persons/infrastructure/persistence/mappers/professor-persistence.mapper.ts

import { Prisma } from '@prisma/client';
import type { ProfessorSaveData } from '@professors/application/ports/out';
import type { ProfessorView } from '@professors/application/read-models';
import { ProfessorStatus } from '@professors/domain/constants';
import { Professor } from '@professors/domain/entities';

type ProfessorRaw = Prisma.ProfessorGetPayload<{ include: { person: true } }>;

type PersonPersistenceData = {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
};

type ProfessorPersistenceData = {
  departmentId: number | null;
  code: string;
  specialty: string | null;
  institutionalEmail: string | null;
  hireDate: Date | null;
  status: ProfessorStatus;
};

type ProfessorPersistencePayload = {
  personData: PersonPersistenceData;
  professorData: ProfessorPersistenceData;
};

export class ProfessorPersistenceMapper {
  static toDomain(raw: ProfessorRaw): Professor {
    return Professor.reconstitute({
      id: raw.personId,
      departmentId: raw.departmentId,
      code: raw.code,
      specialty: raw.specialty,
      institutionalEmail: raw.institutionalEmail,
      hireDate: raw.hireDate,
      status: raw.status as ProfessorStatus,
    });
  }

  static toView(raw: ProfessorRaw): ProfessorView {
    return {
      id: raw.personId,
      departmentId: raw.departmentId,
      code: raw.code,
      specialty: raw.specialty,
      institutionalEmail: raw.institutionalEmail,
      hireDate: raw.hireDate,
      status: raw.status as ProfessorStatus,
      dni: raw.person.dni,
      firstName: raw.person.firstName,
      lastName: raw.person.lastName,
      email: raw.person.email,
      phone: raw.person.phone,
      birthDate: raw.person.birthDate,
    };
  }

  static toPersistence(data: ProfessorSaveData): ProfessorPersistencePayload {
    const { professor, personData } = data;

    return {
      personData: {
        dni: personData.dni,
        firstName: personData.firstName,
        lastName: personData.lastName,
        email: personData.email,
        phone: personData.phone,
        birthDate: personData.birthDate,
      },
      professorData: {
        code: professor.code,
        specialty: professor.specialty,
        institutionalEmail: professor.institutionalEmail,
        hireDate: professor.hireDate,
        status: professor.status,
        departmentId: professor.departmentId,
      },
    };
  }
}
