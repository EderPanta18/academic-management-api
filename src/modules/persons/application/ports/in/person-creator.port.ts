export const PERSON_CREATOR_TOKEN = Symbol('PERSON_CREATOR');

export type PersonCreationData = {
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
};

export interface IPersonCreator {
  /** Crea una persona dentro de la transacción activa. */
  create(actorUserId: string, data: PersonCreationData): Promise<string>;
}
