export const FILE_PARSER_TOKEN = Symbol('FILE_PARSER');

export interface IFileParser {
  parse(buffer: Buffer, extension: string): Record<string, unknown>[];
}
