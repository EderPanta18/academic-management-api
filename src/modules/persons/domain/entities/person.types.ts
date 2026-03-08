// modules/persons/domain/entities/person.types.ts

export interface PersonProps {
  id: number;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
}

export interface CreatePersonProps {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: Date;
}
