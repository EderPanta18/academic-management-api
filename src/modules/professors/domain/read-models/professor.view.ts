// modules/professors/domain/read-models/professor.view.ts

import { type ProfessorProps } from '../entities';

/**
 * Proyección de solo lectura.
 * No tiene comportamiento — es un tipo plano de salida.
 */
export interface ProfessorView extends ProfessorProps {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
  fullName: string;
}
