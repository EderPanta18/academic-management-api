// modules/professors/infrastructure/mappers/professor-persistence.mapper.ts

import { Prisma } from '@prisma/client';
import { ProfessorStatus } from '@professors/domain/constants';
import { Professor, type ProfessorProps } from '@professors/domain/entities';

type ProfessorRaw = Prisma.ProfessorGetPayload<{
  include: { person: true };
}>;

interface ProfessorPersistenceData {
  person: {
    dni: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    birthDate: Date | null;
  };
  professor: {
    departmentId: number | null;
    specialty: string | null;
    hireDate: Date | null;
    status: ProfessorStatus;
  };
}

export class ProfessorPersistenceMapper {
  static toDomain(raw: ProfessorRaw): Professor {
    const props: ProfessorProps = {
      id: raw.personId,
      departmentId: raw.departmentId,
      specialty: raw.specialty,
      hireDate: raw.hireDate,
      status: raw.status as ProfessorStatus,
      dni: raw.person.dni,
      firstName: raw.person.firstName,
      lastName: raw.person.lastName,
      email: raw.person.email,
      phone: raw.person.phone,
      birthDate: raw.person.birthDate,
    };

    return Professor.reconstitute(props);
  }

  static toPersistence(professor: Professor): ProfessorPersistenceData {
    return {
      person: {
        dni: professor.dni,
        firstName: professor.firstName,
        lastName: professor.lastName,
        email: professor.email,
        phone: professor.phone,
        birthDate: professor.birthDate,
      },
      professor: {
        departmentId: professor.departmentId,
        specialty: professor.specialty,
        hireDate: professor.hireDate,
        status: professor.status,
      },
    };
  }
}
