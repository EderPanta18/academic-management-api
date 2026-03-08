// modules/students/domain/read-models/student.view.ts

import { type StudentProps } from '../entities';

/**
 * Proyección de solo lectura.
 */
export interface StudentView extends StudentProps {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
  fullName: string;
}
