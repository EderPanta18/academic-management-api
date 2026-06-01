// modules/persons/infrastructure/persistence/mappers/professor-persistence.mapper.ts

import { Prisma } from "@prisma/client";
import { Professor, type ProfessorProps } from "@professors/domain/entities";
import { ProfessorStatus } from "@professors/domain/constants";
import { type ProfessorView } from "@professors/application/read-models";
import { type ProfessorPersonData } from "@professors/application/ports/out";

type ProfessorRaw = Prisma.ProfessorGetPayload<{ include: { person: true } }>;

export class ProfessorPersistenceMapper {
  static toDomain(raw: ProfessorRaw): Professor {
    const props: ProfessorProps = {
      id: raw.personId,
      departmentId: raw.departmentId,
      code: raw.code,
      specialty: raw.specialty,
      institutionalEmail: raw.institutionalEmail,
      hireDate: raw.hireDate,
      status: raw.status as ProfessorStatus
    };
    return Professor.reconstitute(props);
  }

  static toView(raw: ProfessorRaw): ProfessorView {
    return {
      // Professor fields
      id: raw.personId,
      departmentId: raw.departmentId,
      code: raw.code,
      specialty: raw.specialty,
      institutionalEmail: raw.institutionalEmail,
      hireDate: raw.hireDate,
      status: raw.status as ProfessorStatus,
      // Person fields
      dni: raw.person.dni,
      firstName: raw.person.firstName,
      lastName: raw.person.lastName,
      email: raw.person.email,
      phone: raw.person.phone,
      birthDate: raw.person.birthDate,
      fullName: `${raw.person.firstName} ${raw.person.lastName}`.trim()
    };
  }

  static toPersistence(professor: Professor, personData: ProfessorPersonData) {
    return {
      person: {
        dni: personData.dni,
        firstName: personData.firstName,
        lastName: personData.lastName,
        email: personData.email,
        phone: personData.phone ?? null,
        birthDate: personData.birthDate ?? null
      },
      professor: {
        code: professor.code,
        specialty: professor.specialty,
        institutionalEmail: professor.institutionalEmail,
        hireDate: professor.hireDate,
        status: professor.status,
        departmentId: professor.departmentId
      }
    };
  }
}
