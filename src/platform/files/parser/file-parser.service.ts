// src/platform/files/parser/file-parser.service.ts

import type { FileFormat, IFileParser, ParsedRow } from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { CsvFileParserStrategy, XlsxFileParserStrategy } from './strategies';

@Injectable()
export class FileParserService implements IFileParser {
  constructor(
    private readonly csvParser: CsvFileParserStrategy,
    private readonly xlsxParser: XlsxFileParserStrategy,
  ) {}

  parse(content: Uint8Array, format: FileFormat): Promise<ParsedRow[]> {
    switch (format) {
      case 'csv':
        return this.csvParser.parse(content);

      case 'xlsx':
        return this.xlsxParser.parse(content);

      default:
        throw new SystemException('El parser recibió un formato fuera de su contrato.');
    }
  }
}
