export interface PersonProps {
  id: string;
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
}

export interface CreatePersonProps {
  id: string;
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: Date | null;
}
