// shared/decorators/trim.decorator.ts

import { Transform } from "class-transformer";

export function Trim(): PropertyDecorator {
  return Transform(({ value }) => {
    if (value === null || value === undefined) return "";

    return String(value).trim();
  });
}

export function TrimOptional(): PropertyDecorator {
  return Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;

    const text = String(value).trim();

    return text === "" ? undefined : text;
  });
}
