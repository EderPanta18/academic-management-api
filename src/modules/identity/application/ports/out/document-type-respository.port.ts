export const DOCUMENT_TYPE_REPOSITORY_TOKEN = Symbol('DOCUMENT_TYPE_REPOSITORY');

export interface IDocumentTypeRepository {
  exists(id: string): Promise<boolean>;
}
