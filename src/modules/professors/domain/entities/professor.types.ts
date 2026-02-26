// modules/professors/domain/entities/professor.types.ts

import { ProfessorStatus } from '../constants';

/**
 * Props de un profesor ya persistido.
 */
export interface ProfessorProps {
  id: number;
  departmentId: number | null;
  code: string;
  specialty: string | null;
  institutionalEmail: string | null;
  hireDate: Date | null;
  status: ProfessorStatus;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
}

/**
 * Props de entrada para crear un nuevo profesor.
 */
export interface CreateProfessorProps {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  code: string;
  departmentId?: number;
  specialty?: string;
  institutionalEmail?: string;
  hireDate?: Date;
  phone?: string;
  birthDate?: Date;
  status?: ProfessorStatus;
}
