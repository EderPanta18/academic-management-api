import type { IFileParser } from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { FILE_PARSER_STRATEGIES_TOKEN, type IFileParserStrategy } from './strategies';

@Injectable()
export class FileParserService implements IFileParser {
  constructor(
    @Inject(FILE_PARSER_STRATEGIES_TOKEN)
    private readonly strategies: IFileParserStrategy[],
  ) {}

  parse(buffer: Buffer, extension: string): Record<string, unknown>[] {
    const normalizedExt = extension.startsWith('.') ? extension : `.${extension}`;

    const strategy = this.strategies.find((s) => s.canHandle(normalizedExt));

    if (!strategy)
      throw new SystemException(
        `No hay una estrategia registrada para la extensión "${normalizedExt}".`,
      );

    return strategy.parse(buffer);
  }
}
