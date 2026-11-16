// src/modules/persons/application/ports/out/document-type-query.port.ts

import type { DocumentTypeReadModel } from '@persons/application/read-models';

export const DOCUMENT_TYPE_QUERY_TOKEN = Symbol('DOCUMENT_TYPE_QUERY');

export interface IDocumentTypeQuery {
  /**
   * Consulta los tipos de documento.
   */
  findAll(): Promise<DocumentTypeReadModel[]>;
}
