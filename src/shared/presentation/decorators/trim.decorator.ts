// shared/presentation/decorators/trim.decorator.ts

import { Transform } from 'class-transformer';

/**
 * Recorta espacios del string resultante.
 * Uso: campos requeridos donde el valor vacío no es válido.
 */
export const Trim = (): PropertyDecorator =>
  Transform(({ value }) => {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  });

/**
 * Igual que @Trim() pero para campos opcionales:
 * si el resultado es cadena vacía devuelve undefined
 * para que @IsOptional() funcione correctamente.
 */
export const TrimOptional = (): PropertyDecorator =>
  Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    const str = String(value).trim();
    return str === '' ? undefined : str;
  });
