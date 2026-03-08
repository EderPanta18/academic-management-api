// modules/students/infrastructure/persistence/mappers/student-persistence.mapper.ts

import { Prisma } from '@prisma/client';
import { Student, type StudentProps } from '@students/domain/entities';
import { StudentStatus } from '@students/domain/constants';
import { type StudentView } from '@students/domain/read-models';
import { type PersonCreationData } from '@students/domain/ports/out';

type StudentRaw = Prisma.StudentGetPayload<{ include: { person: true } }>;

export class StudentPersistenceMapper {
  static toDomain(raw: StudentRaw): Student {
    const props: StudentProps = {
      id: raw.personId,
      careerId: raw.careerId,
      code: raw.code,
      institutionalEmail: raw.institutionalEmail,
      enrollmentDate: raw.enrollmentDate,
      status: raw.status as StudentStatus,
    };
    return Student.reconstitute(props);
  }

  static toView(raw: StudentRaw): StudentView {
    return {
      // Student fields
      id: raw.personId,
      careerId: raw.careerId,
      code: raw.code,
      institutionalEmail: raw.institutionalEmail,
      enrollmentDate: raw.enrollmentDate,
      status: raw.status as StudentStatus,
      // Person fields
      dni: raw.person.dni,
      firstName: raw.person.firstName,
      lastName: raw.person.lastName,
      email: raw.person.email,
      phone: raw.person.phone,
      birthDate: raw.person.birthDate,
      fullName: `${raw.person.firstName} ${raw.person.lastName}`.trim(),
    };
  }

  static toPersistence(student: Student, personData: PersonCreationData) {
    return {
      person: {
        dni: personData.dni,
        firstName: personData.firstName,
        lastName: personData.lastName,
        email: personData.email,
        phone: personData.phone ?? null,
        birthDate: personData.birthDate ?? null,
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
