// platform/files/parser/file-parser.service.ts

import { Inject, Injectable } from "@nestjs/common";

import { FILE_PARSER_STRATEGIES, type IFileParserStrategy } from "./strategies";
import type { IFileParser } from "./file-parser.port";

@Injectable()
export class FileParserService implements IFileParser {
  constructor(
    @Inject(FILE_PARSER_STRATEGIES)
    private readonly strategies: IFileParserStrategy[]
  ) {}

  parse(
    buffer: Buffer,
    extension: string,
    allowedExtensions?: string[]
  ): Record<string, unknown>[] {
    if (allowedExtensions && !allowedExtensions.includes(extension))
      throw new Error(`Formato no permitido: "${extension}"`);

    const strategy = this.strategies.find((s) => s.canHandle(extension));

    if (!strategy) throw new Error(`Formato no soportado: "${extension}"`);

    return strategy.parse(buffer);
  }
}
