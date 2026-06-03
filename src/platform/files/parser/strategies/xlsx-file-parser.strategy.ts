// shared/infrastructure/file-parser/xlsx-file-parser.strategy.ts

import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import type { IFileParserStrategy } from './file-parser.strategy';

@Injectable()
export class XlsxFileParserStrategy implements IFileParserStrategy {
  canHandle(ext: string): boolean {
    return ext === '.xlsx';
  }

  parse(buffer: Buffer): Record<string, unknown>[] {
    const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheet = wb.Sheets[wb.SheetNames[0]];

    return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: '',
    });
  }
}
