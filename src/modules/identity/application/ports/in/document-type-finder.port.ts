// src/modules/identity/application/ports/in/document-type-finder.port.ts

export const DOCUMENT_TYPE_FINDER_TOKEN = Symbol('DOCUMENT_TYPE_FINDER');

export interface IDocumentTypeFinder {
  findIdByCode(code: string): Promise<string | null>;
}
