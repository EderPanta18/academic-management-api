// modules/students/domain/entities/student.types.ts

import { StudentStatus } from '../constants';

/**
 * Props de un estudiante ya persistido.
 */
export interface StudentProps {
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
}

/**
 * Props de entrada para crear un nuevo estudiante.
 */
export interface CreateStudentProps {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  careerId: number;
  code: string;
  enrollmentDate: Date;
  institutionalEmail?: string;
  status?: StudentStatus;
  phone?: string;
  birthDate?: Date;
}
