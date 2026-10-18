import type { Prisma } from '@prisma/client';
import type { StudentCreationData } from '@students/application/ports/out';
import { Student, type StudentStatus } from '@students/domain/entities';

type StudentRaw = Prisma.StudentGetPayload<Record<string, never>>;

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

type StudentPersistenceData = {
  id: string;
  personId: string;
  academicProgramId: string;
  code: string;
  institutionalEmail: string | null;
  admissionPeriod: string | null;
  status: StudentStatus;
};

type StudentPersistencePayload = {
  personData: PersonPersistenceData;
  studentData: StudentPersistenceData;
};

export class StudentRepositoryMapper {
  static toDomain(raw: StudentRaw): Student {
    return Student.reconstitute({
      id: raw.id,
      personId: raw.personId,
      academicProgramId: raw.academicProgramId,
      code: raw.code,
      institutionalEmail: raw.institutionalEmail,
      admissionPeriod: raw.admissionPeriod,
      status: raw.status as StudentStatus,
    });
  }

  static toPersistence(data: StudentCreationData): StudentPersistencePayload {
    const { student, personData } = data;

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
      studentData: {
        id: student.id,
        personId: student.personId,
        academicProgramId: student.academicProgramId,
        code: student.code,
        institutionalEmail: student.institutionalEmail,
        admissionPeriod: student.admissionPeriod,
        status: student.status,
      },
    };
  }
}
