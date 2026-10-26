// src/platform/files/parser/strategies/xlsx-file-parser.strategy.ts

import type { ParsedRow } from '@core/contracts';
import { ValidationException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import type { IFileParserStrategy } from './file-parser.strategy';
import { isBlankRow, mapRow, parseHeaders } from './tabular-rows';

type RowCells = Map<number, XLSX.CellObject>;

function getCellText(cell?: XLSX.CellObject): string {
  if (!cell || cell.t === 'z') return '';

  return cell.w ?? String(cell.v ?? '');
}

function getCellIssues(cells: RowCells): string[] {
  const issues = new Set<string>();

  for (const cell of cells.values()) {
    if (cell.f) issues.add('La fila contiene fórmulas.');

    if (cell.t === 'e') issues.add('La fila contiene celdas con errores.');
  }

  return [...issues];
}

function readWorksheetRows(sheet: XLSX.WorkSheet): Map<number, RowCells> {
  const rows = new Map<number, RowCells>();

  for (const address of Object.keys(sheet)) {
    if (!/^[A-Z]+[1-9][0-9]*$/.test(address)) continue;

    const cell = sheet[address] as XLSX.CellObject | undefined;

    if (!cell) continue;

    const { r, c } = XLSX.utils.decode_cell(address);

    let row = rows.get(r);

    if (!row) {
      row = new Map<number, XLSX.CellObject>();
      rows.set(r, row);
    }

    row.set(c, cell);
  }

  return rows;
}

@Injectable()
export class XlsxFileParserStrategy implements IFileParserStrategy {
  async parse(content: Uint8Array): Promise<ParsedRow[]> {
    if (
      content.length < 4 ||
      content[0] !== 0x50 ||
      content[1] !== 0x4b ||
      content[2] !== 0x03 ||
      content[3] !== 0x04
    )
      throw new ValidationException('El archivo no contiene una estructura XLSX válida.');

    let workbook: XLSX.WorkBook;

    try {
      workbook = XLSX.read(content, {
        type: 'array',
        cellDates: false,
        cellFormula: true,
        cellText: true,
      });
    } catch {
      throw new ValidationException('No se pudo interpretar el archivo XLSX.');
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = sheetName ? workbook.Sheets[sheetName] : undefined;

    if (!sheet) throw new ValidationException('El archivo XLSX no contiene una hoja válida.');

    const rows = [...readWorksheetRows(sheet).entries()]
      .sort(([a], [b]) => a - b)
      .filter(([, cells]) => {
        const values = [...cells.values()].map(getCellText);

        return !isBlankRow(values) || getCellIssues(cells).length > 0;
      });

    if (rows.length === 0) throw new ValidationException('La hoja XLSX no contiene encabezados.');

    const [, headerCells] = rows[0];

    if (getCellIssues(headerCells).length > 0)
      throw new ValidationException('El encabezado XLSX contiene fórmulas o celdas con errores.');

    const headerColumns = [...headerCells.entries()]
      .filter(([, cell]) => getCellText(cell).trim() !== '')
      .map(([column]) => column)
      .sort((a, b) => a - b);

    if (headerColumns.length === 0)
      throw new ValidationException('La hoja XLSX no contiene encabezados válidos.');

    const firstColumn = headerColumns[0];
    const lastColumn = headerColumns[headerColumns.length - 1];

    const headers = parseHeaders(
      Array.from({ length: lastColumn - firstColumn + 1 }, (_, index) =>
        getCellText(headerCells.get(firstColumn + index)),
      ),
    );

    const results: ParsedRow[] = [];

    for (const [rowIndex, cells] of rows.slice(1)) {
      const issues = getCellIssues(cells);

      const values = headers.map((_, index) => getCellText(cells.get(firstColumn + index)));

      const hasExtraData = [...cells.entries()].some(
        ([column, cell]) =>
          (column < firstColumn || column > lastColumn) && getCellText(cell).trim() !== '',
      );

      if (hasExtraData) issues.push('La fila contiene datos en columnas sin encabezado.');

      const location = {
        rowNumber: rowIndex + 1,
        sheetName,
      };

      if (issues.length > 0) {
        results.push({
          status: 'unreadable',
          location,
          issues,
        });

        continue;
      }

      if (isBlankRow(values)) continue;

      results.push({
        status: 'parsed',
        location,
        values: mapRow(headers, values),
      });
    }

    return results;
  }
}
