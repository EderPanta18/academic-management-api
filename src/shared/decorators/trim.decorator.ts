// src/shared/decorators/trim.decorator.ts

import { Transform } from 'class-transformer';

export function Trim(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );
}

export function TrimOptional(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;

    const trimmed = value.trim();

    return trimmed === '' ? undefined : trimmed;
  });
}
