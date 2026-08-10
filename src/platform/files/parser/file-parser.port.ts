// platform/files/parser/file-parser.port.ts

export const FILE_PARSER_TOKEN = Symbol('FILE_PARSER');

export interface IFileParser {
  parse(buffer: Buffer, extension: string, allowedExtensions?: string[]): Record<string, unknown>[];
}
