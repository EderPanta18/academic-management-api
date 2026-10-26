// src/platform/files/parser/strategies/tabular-rows.ts

import { ValidationException } from '@core/exceptions';

export function parseHeaders(values: readonly string[]): string[] {
  const headers = values.map((value) => value.trim());

  if (headers.length === 0 || headers.some((header) => header === ''))
    throw new ValidationException('El archivo debe contener encabezados válidos y no vacíos.');

  if (new Set(headers).size !== headers.length)
    throw new ValidationException('El archivo contiene encabezados duplicados.');

  return headers;
}

export function isBlankRow(values: readonly string[]): boolean {
  return values.every((value) => value.trim() === '');
}

export function mapRow(
  headers: readonly string[],
  values: readonly string[],
): Record<string, unknown> {
  return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
}
