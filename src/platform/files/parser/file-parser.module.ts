// src/platform/files/parser/file-parser.module.ts

import { FILE_PARSER_TOKEN } from '@core/contracts';
import { Module } from '@nestjs/common';
import { FileParserService } from './file-parser.service';
import { CsvFileParserStrategy, XlsxFileParserStrategy } from './strategies';

@Module({
  providers: [
    CsvFileParserStrategy,
    XlsxFileParserStrategy,
    {
      provide: FILE_PARSER_TOKEN,
      useClass: FileParserService,
    },
  ],
  exports: [FILE_PARSER_TOKEN],
})
export class FileParserModule {}
