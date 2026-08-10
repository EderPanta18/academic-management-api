// platform/files/parser/file-parser.module.ts

import { Module } from '@nestjs/common';
import { FILE_PARSER_TOKEN } from './file-parser.port';
import { FileParserService } from './file-parser.service';
import {
  CsvFileParserStrategy,
  FILE_PARSER_STRATEGIES_TOKEN,
  XlsxFileParserStrategy,
} from './strategies';

@Module({
  providers: [
    CsvFileParserStrategy,
    XlsxFileParserStrategy,
    {
      provide: FILE_PARSER_STRATEGIES_TOKEN,
      useFactory: (...strategies) => strategies,
      inject: [CsvFileParserStrategy, XlsxFileParserStrategy],
    },
    FileParserService,
    { provide: FILE_PARSER_TOKEN, useExisting: FileParserService },
  ],
  exports: [FILE_PARSER_TOKEN],
})
export class FileParserModule {}
