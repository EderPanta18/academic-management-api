// modules/persons/application/contracts/person-data.contract.ts

export type PersonData = {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
};
