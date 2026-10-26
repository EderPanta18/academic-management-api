// src/platform/files/parser/strategies/csv-file-parser.strategy.ts

import type { ParsedRow } from '@core/contracts';
import { ValidationException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import type { IFileParserStrategy } from './file-parser.strategy';
import { isBlankRow, mapRow, parseHeaders } from './tabular-rows';

type CsvRecord = {
  rowNumber: number;
  values: string[];
  issues: string[];
};

type CsvState = 'start' | 'unquoted' | 'quoted' | 'after-quote';

function readCsvRecords(content: string): CsvRecord[] {
  const records: CsvRecord[] = [];

  let values: string[] = [];
  let field = '';
  let issues = new Set<string>();

  let state: CsvState = 'start';
  let lineNumber = 1;
  let recordStartLine = 1;

  const finishField = (): void => {
    values.push(field);
    field = '';
    state = 'start';
  };

  const finishRecord = (): void => {
    finishField();

    records.push({
      rowNumber: recordStartLine,
      values,
      issues: [...issues],
    });

    values = [];
    issues = new Set<string>();
  };

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '\r' || char === '\n') {
      const newline = char === '\r' && content[i + 1] === '\n' ? '\r\n' : char;

      if (state === 'quoted') {
        field += newline;
      } else {
        finishRecord();
        recordStartLine = lineNumber + 1;
      }

      if (newline === '\r\n') i++;

      lineNumber++;

      continue;
    }

    switch (state) {
      case 'start':
        if (char === '"') {
          state = 'quoted';
        } else if (char === ',') {
          finishField();
        } else {
          field += char;
          state = 'unquoted';
        }

        break;

      case 'unquoted':
        if (char === ',') {
          finishField();
        } else if (char === '"') {
          issues.add('Comillas en una posición CSV inválida.');
          field += char;
        } else {
          field += char;
        }

        break;

      case 'quoted':
        if (char === '"' && content[i + 1] === '"') {
          field += '"';
          i++;
        } else if (char === '"') {
          state = 'after-quote';
        } else {
          field += char;
        }

        break;

      case 'after-quote':
        if (char === ',') {
          finishField();
        } else {
          issues.add('Caracteres inesperados después de cerrar comillas.');
          field += char;
          state = 'unquoted';
        }

        break;
    }
  }

  if (state === 'quoted')
    throw new ValidationException('El archivo CSV contiene un campo entrecomillado sin cerrar.');

  if (content.length > 0 && !/[\r\n]$/.test(content)) finishRecord();

  return records;
}

@Injectable()
export class CsvFileParserStrategy implements IFileParserStrategy {
  async parse(content: Uint8Array): Promise<ParsedRow[]> {
    let text: string;

    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(content);
    } catch {
      throw new ValidationException('El archivo CSV debe utilizar una codificación UTF-8 válida.');
    }

    const records = readCsvRecords(text);

    const headerIndex = records.findIndex((record) => !isBlankRow(record.values));

    if (headerIndex === -1 || records[headerIndex].issues.length > 0)
      throw new ValidationException('No se pudo interpretar el encabezado del archivo CSV.');

    const headers = parseHeaders(records[headerIndex].values);

    return records
      .slice(headerIndex + 1)
      .filter((record) => record.issues.length > 0 || !isBlankRow(record.values))
      .map((record): ParsedRow => {
        const issues = [...record.issues];

        if (
          record.values.length > headers.length &&
          !isBlankRow(record.values.slice(headers.length))
        )
          issues.push('La fila contiene datos en columnas sin encabezado.');

        const location = {
          rowNumber: record.rowNumber,
        };

        if (issues.length > 0)
          return {
            status: 'unreadable',
            location,
            issues,
          };

        return {
          status: 'parsed',
          location,
          values: mapRow(headers, record.values),
        };
      });
  }
}
