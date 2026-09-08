export const PERSON_REPOSITORY_TOKEN = Symbol('PERSON_REPOSITORY');

export interface IPersonRepository {
  existsByDocumentTypeIdAndNumber(documentTypeId: string, documentNumber: string): Promise<boolean>;

  existsByEmail(email: string): Promise<boolean>;

  existsByPhone(phone: string): Promise<boolean>;

  isDeleted(id: string): Promise<boolean>;
}
