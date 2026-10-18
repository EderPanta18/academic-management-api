export type PersonUniquenessCheckInput = {
  documentTypeId: string;
  documentNumber: string;
  email: string | null;
  phone: string | null;
};

export type PersonCreationData = {
  id: string;
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
};
