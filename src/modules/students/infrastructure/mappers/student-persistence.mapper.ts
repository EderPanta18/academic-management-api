// modules/students/infrastructure/mappers/student-persistence.mapper.ts

import { Prisma } from '@prisma/client';
import { StudentStatus } from '@students/domain/constants';
import { Student, type StudentProps } from '@students/domain/entities';

type StudentRaw = Prisma.StudentGetPayload<{
  include: { person: true };
}>;

interface StudentPersistenceData {
  person: {
    dni: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    birthDate: Date | null;
  };
  student: {
    careerId: number;
    code: string;
    institutionalEmail: string | null;
    enrollmentDate: Date;
    status: StudentStatus;
  };
}

export class StudentPersistenceMapper {
  static toDomain(raw: StudentRaw): Student {
    const props: StudentProps = {
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

    return Student.reconstitute(props);
  }

  static toPersistence(student: Student): StudentPersistenceData {
    return {
      person: {
        dni: student.dni,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        birthDate: student.birthDate,
      },
      student: {
        careerId: student.careerId,
        code: student.code,
        institutionalEmail: student.institutionalEmail,
        enrollmentDate: student.enrollmentDate,
        status: student.status,
      },
    };
  }
}
