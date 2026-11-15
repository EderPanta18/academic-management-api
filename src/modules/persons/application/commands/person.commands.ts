export type CreatePersonCommand = {
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
};

export type UpdatePersonCommand = {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  birthDate?: Date | null;
};
