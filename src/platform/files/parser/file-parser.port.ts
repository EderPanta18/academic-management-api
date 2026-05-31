// platform/files/parser/file-parser.port.ts

export const FILE_PARSER_PORT = Symbol("FILE_PARSER_PORT");

export interface IFileParser {
  parse(
    buffer: Buffer,
    extension: string,
    allowedExtensions?: string[]
  ): Record<string, unknown>[];
}
