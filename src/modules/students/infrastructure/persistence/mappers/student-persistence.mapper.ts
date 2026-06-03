// modules/students/infrastructure/persistence/mappers/student-persistence.mapper.ts

import type { Prisma } from '@prisma/client';
import type { StudentSaveData } from '@students/application/ports/out';
import type { StudentView } from '@students/application/read-models';
import type { StudentStatus } from '@students/domain/constants';
import { Student } from '@students/domain/entities';

type StudentRaw = Prisma.StudentGetPayload<{ include: { person: true } }>;

type PersonPersistenceData = {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
};

type StudentPersistenceData = {
  careerId: number;
  code: string;
  institutionalEmail: string | null;
  enrollmentDate: Date;
  status: StudentStatus;
};

type StudentPersistencePayload = {
  personData: PersonPersistenceData;
  studentData: StudentPersistenceData;
};

export class StudentPersistenceMapper {
  static toDomain(raw: StudentRaw): Student {
    return Student.reconstitute({
      id: raw.personId,
      careerId: raw.careerId,
      code: raw.code,
      institutionalEmail: raw.institutionalEmail,
      enrollmentDate: raw.enrollmentDate,
      status: raw.status as StudentStatus,
    });
  }

  static toView(raw: StudentRaw): StudentView {
    return {
      id: raw.personId,
      careerId: raw.careerId,
      code: raw.code,
      institutionalEmail: raw.institutionalEmail,
      enrollmentDate: raw.enrollmentDate,
      status: raw.status as StudentStatus,
      dni: raw.person.dni,
      firstName: raw.person.firstName,
      lastName: raw.person.lastName,
      email: raw.person.email,
      phone: raw.person.phone,
      birthDate: raw.person.birthDate,
    };
  }

  static toPersistence(data: StudentSaveData): StudentPersistencePayload {
    const { student, personData } = data;

    return {
      personData: {
        dni: personData.dni,
        firstName: personData.firstName,
        lastName: personData.lastName,
        email: personData.email,
        phone: personData.phone,
        birthDate: personData.birthDate,
      },
      studentData: {
        careerId: student.careerId,
        code: student.code,
        institutionalEmail: student.institutionalEmail,
        enrollmentDate: student.enrollmentDate,
        status: student.status,
      },
    };
  }
}
