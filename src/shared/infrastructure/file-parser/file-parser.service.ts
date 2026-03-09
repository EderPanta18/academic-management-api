// shared/infrastructure/file-parser/file-parser.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { type IFileParser } from '@shared/application/ports/out';
import { FILE_PARSER_STRATEGIES, type IFileParserStrategy } from './strategies';

@Injectable()
export class FileParserService implements IFileParser {
  constructor(
    @Inject(FILE_PARSER_STRATEGIES)
    private readonly strategies: IFileParserStrategy[],
  ) {}

  parse(
    buffer: Buffer,
    extension: string,
    allowedExtensions?: string[],
  ): Record<string, unknown>[] {
    if (allowedExtensions && !allowedExtensions.includes(extension)) {
      throw new Error(`Formato no permitido: "${extension}"`);
    }

    const strategy = this.strategies.find((s) => s.canHandle(extension));
    if (!strategy) {
      throw new Error(`Formato no soportado: "${extension}"`);
    }
    return strategy.parse(buffer);
  }
}
