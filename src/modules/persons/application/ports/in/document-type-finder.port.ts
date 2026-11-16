// src/modules/persons/application/ports/in/document-type-finder.port.ts

export const DOCUMENT_TYPE_FINDER_TOKEN = Symbol('DOCUMENT_TYPE_FINDER');

export interface IDocumentTypeFinder {
  /** Busca el identificador de un tipo de documento por su código. */
  findIdByCode(code: string): Promise<string | null>;
}
