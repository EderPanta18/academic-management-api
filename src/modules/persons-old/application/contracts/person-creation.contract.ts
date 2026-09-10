// modules/persons/application/contracts/person-creation.contract.ts

export type PersonCreationInput = {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: Date | null;
};
