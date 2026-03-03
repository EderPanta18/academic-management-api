// shared/infrastructure/file-parser/csv-file-parser.strategy.ts

import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { type IFileParserStrategy } from './file-parser.strategy';

@Injectable()
export class CsvFileParserStrategy implements IFileParserStrategy {
  canHandle(ext: string): boolean {
    return ext === '.csv';
  }

  parse(buffer: Buffer): Record<string, unknown>[] {
    const wb = XLSX.read(buffer.toString('utf8'), {
      type: 'string',
      raw: true,
    });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: '',
      raw: true,
    });
  }
}
