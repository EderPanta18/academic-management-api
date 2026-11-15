export type PersonReadModel = {
  id: string;
  documentTypeCode: string;
  documentTypeName: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
};
