// src/modules/persons/application/read-models/person.read-models.ts

export type PersonReadModel = {
  id: string;
  documentTypeId: string;
  documentTypeCode: string;
  documentTypeName: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
};
