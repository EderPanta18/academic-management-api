// shared/application/ports/file-parser.port.ts

export interface IFileParser {
  parse(
    buffer: Buffer,
    extension: string,
    allowedExtensions?: string[],
  ): Record<string, unknown>[];
}
