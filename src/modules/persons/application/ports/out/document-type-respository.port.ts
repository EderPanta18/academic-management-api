import type { DocumentType } from '@persons/domain/models';

export const DOCUMENT_TYPE_REPOSITORY_TOKEN = Symbol('DOCUMENT_TYPE_REPOSITORY');

export interface IDocumentTypeRepository {
  /**
   * Comprueba si existe un tipo de documento.
   */
  exists(id: string): Promise<boolean>;

  /**
   * Busca un tipo de documento por su código.
   */
  findByCode(code: string): Promise<DocumentType | null>;
}
