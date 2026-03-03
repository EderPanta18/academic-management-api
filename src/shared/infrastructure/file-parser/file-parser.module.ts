// shared/infrastructure/file-parser/file-parser.module.ts

import { Module } from '@nestjs/common';
import { FILE_PARSER_PORT } from '@shared/application/ports';
import {
  FILE_PARSER_STRATEGIES,
  CsvFileParserStrategy,
  XlsxFileParserStrategy,
} from './strategies';
import { FileParserService } from './file-parser.service';

@Module({
  providers: [
    CsvFileParserStrategy,
    XlsxFileParserStrategy,
    {
      provide: FILE_PARSER_STRATEGIES,
      useFactory: (
        csv: CsvFileParserStrategy,
        xlsx: XlsxFileParserStrategy,
      ) => [csv, xlsx],
      inject: [CsvFileParserStrategy, XlsxFileParserStrategy],
    },
    FileParserService,
    { provide: FILE_PARSER_PORT, useExisting: FileParserService },
  ],
  exports: [FILE_PARSER_PORT],
})
export class FileParserModule {}
