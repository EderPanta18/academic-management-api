// src/platform/files/parser/strategies/file-parser.strategy.ts

import type { ParsedRow } from '@core/contracts';

export interface IFileParserStrategy {
  parse(content: Uint8Array): Promise<ParsedRow[]>;
}
