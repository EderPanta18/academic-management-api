// platform/files/parser/strategies/file-parser.strategy.ts

export const FILE_PARSER_STRATEGIES = Symbol('FILE_PARSER_STRATEGIES');

export interface IFileParserStrategy {
  canHandle(extension: string): boolean;

  parse(buffer: Buffer): Record<string, unknown>[];
}
