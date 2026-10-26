// src/core/contracts/file-parser.contract.ts

export const FILE_PARSER_TOKEN = Symbol('FILE_PARSER');

export type FileFormat = 'csv' | 'xlsx';

export type SourceRowLocation = {
  /** Primera línea física del registro CSV o número de fila de la hoja XLSX (base 1). */
  rowNumber: number;

  /** Identifica la hoja cuando se procesan varias hojas de un libro XLSX. */
  sheetName?: string;
};

export type ParsedRow =
  | {
      status: 'parsed';
      location: SourceRowLocation;
      values: Record<string, unknown>;
    }
  | {
      status: 'unreadable';
      location: SourceRowLocation;
      issues: string[];
    };

export interface IFileParser {
  /**
   * Conserva la ubicación original aunque omita filas vacías.
   * Una fila ilegible no impide devolver las demás; un archivo que no
   * puede interpretarse en conjunto provoca un error de la operación.
   * No aplica reglas de validación de estudiantes ni ejecuta fórmulas.
   */
  parse(content: Uint8Array, format: FileFormat): Promise<ParsedRow[]>;
}
