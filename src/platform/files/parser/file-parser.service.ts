// platform/files/parser/file-parser.service.ts

import { SystemException } from '@core/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import type { IFileParser } from './file-parser.port';
import { FILE_PARSER_STRATEGIES_TOKEN, type IFileParserStrategy } from './strategies';

@Injectable()
export class FileParserService implements IFileParser {
  constructor(
    @Inject(FILE_PARSER_STRATEGIES_TOKEN)
    private readonly strategies: IFileParserStrategy[],
  ) {}

  parse(
    buffer: Buffer,
    extension: string,
    allowedExtensions?: string[],
  ): Record<string, unknown>[] {
    const normalizedExt = extension.startsWith('.') ? extension : `.${extension}`;

    if (allowedExtensions && !allowedExtensions.includes(normalizedExt))
      throw new SystemException(`Formato no permitido: "${normalizedExt}".`);

    const strategy = this.strategies.find((s) => s.canHandle(normalizedExt));

    if (!strategy) throw new SystemException(`Formato no soportado: "${normalizedExt}".`);

    return strategy.parse(buffer);
  }
}
