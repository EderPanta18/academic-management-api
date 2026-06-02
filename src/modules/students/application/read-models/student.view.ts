// modules/students/application/read-models/student.view.ts

import { StudentStatus } from "@students/domain/constants";

export type StudentView = {
  id: number;
  careerId: number;
  code: string;
  institutionalEmail: string | null;
  enrollmentDate: Date;
  status: StudentStatus;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
};
