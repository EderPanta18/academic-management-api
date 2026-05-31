import { Transform } from 'class-transformer';

export const Trim = (): PropertyDecorator =>
  Transform(({ value }) => {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value).trim();
  });

export const TrimOptional = (): PropertyDecorator =>
  Transform(({ value }) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    const text = String(value).trim();

    return text === '' ? undefined : text;
  });

