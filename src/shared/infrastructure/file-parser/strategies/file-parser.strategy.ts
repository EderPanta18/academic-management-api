// shared/infrastructure/file-parser/file-parser.strategy.ts

export interface IFileParserStrategy {
  canHandle(extension: string): boolean;
  parse(buffer: Buffer): Record<string, unknown>[];
}
