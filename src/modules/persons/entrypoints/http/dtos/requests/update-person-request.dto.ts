// src/modules/persons/entrypoints/http/dtos/requests/update-person-request.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Trim, TrimOptional } from '@shared/decorators';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PERSON_FIELDS } from './person-fields.constants';

export class UpdatePersonRequestDto {
  @ApiPropertyOptional({
    maxLength: PERSON_FIELDS.firstName.maxLength,
    description: 'Nuevos nombres de la persona.',
    example: 'Juan Carlos',
  })
  @Trim()
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los nombres no pueden estar vacíos' })
  @MaxLength(PERSON_FIELDS.firstName.maxLength, {
    message: `Los nombres no pueden tener más de ${PERSON_FIELDS.firstName.maxLength} caracteres`,
  })
  firstName?: string;

  @ApiPropertyOptional({
    maxLength: PERSON_FIELDS.lastName.maxLength,
    description: 'Nuevos apellidos de la persona.',
    example: 'Pérez García',
  })
  @Trim()
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los apellidos no pueden estar vacíos' })
  @MaxLength(PERSON_FIELDS.lastName.maxLength, {
    message: `Los apellidos no pueden tener más de ${PERSON_FIELDS.lastName.maxLength} caracteres`,
  })
  lastName?: string;

  @ApiPropertyOptional({
    nullable: true,
    maxLength: PERSON_FIELDS.email.maxLength,
    description: 'Nuevo correo electrónico personal.',
    example: 'juan.perez@example.com',
  })
  @TrimOptional()
  @ValidateIf((_, value: unknown) => value !== undefined && value !== null)
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @MaxLength(PERSON_FIELDS.email.maxLength, {
    message: `El correo electrónico no puede tener más de ${PERSON_FIELDS.email.maxLength} caracteres`,
  })
  email?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    maxLength: PERSON_FIELDS.phone.maxLength,
    description: 'Nuevo número telefónico.',
    example: '987654321',
  })
  @TrimOptional()
  @ValidateIf((_, value: unknown) => value !== undefined && value !== null)
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MaxLength(PERSON_FIELDS.phone.maxLength, {
    message: `El teléfono no puede tener más de ${PERSON_FIELDS.phone.maxLength} caracteres`,
  })
  phone?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
    format: 'date',
    description: 'Nueva fecha de nacimiento en formato YYYY-MM-DD.',
    example: '2000-05-15',
  })
  @ValidateIf((_, value: unknown) => value !== undefined && value !== null)
  @IsString({ message: 'La fecha de nacimiento debe ser una cadena de texto' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de nacimiento debe tener el formato YYYY-MM-DD',
  })
  @IsDateString(
    { strict: true },
    {
      message: 'La fecha de nacimiento debe ser una fecha válida',
    },
  )
  birthDate?: string | null;
}
