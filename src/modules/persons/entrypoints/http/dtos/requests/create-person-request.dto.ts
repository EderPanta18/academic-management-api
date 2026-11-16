// src/modules/persons/entrypoints/http/dtos/requests/create-person-request.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim, TrimOptional } from '@shared/decorators';
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { PERSON_FIELDS } from './person-fields.constants';

export class CreatePersonRequestDto {
  @ApiProperty({
    format: 'uuid',
    description: 'ID del tipo de documento.',
    example: 'a1b2c3d4-e5f6-4890-9234-56789abcdef0',
  })
  @IsDefined({ message: 'El tipo de documento es obligatorio' })
  @IsUUID('4', { message: 'El tipo de documento debe ser un UUID válido' })
  documentTypeId!: string;

  @ApiProperty({
    maxLength: PERSON_FIELDS.documentNumber.maxLength,
    description: 'Número de documento de identidad.',
    example: '12345678',
  })
  @Trim()
  @IsDefined({ message: 'El número de documento es obligatorio' })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número de documento no puede estar vacío' })
  @MaxLength(PERSON_FIELDS.documentNumber.maxLength, {
    message: `El número de documento no puede tener más de ${PERSON_FIELDS.documentNumber.maxLength} caracteres`,
  })
  documentNumber!: string;

  @ApiProperty({
    maxLength: PERSON_FIELDS.firstName.maxLength,
    description: 'Nombres de la persona.',
    example: 'Juan Carlos',
  })
  @Trim()
  @IsDefined({ message: 'Los nombres son obligatorios' })
  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los nombres no pueden estar vacíos' })
  @MaxLength(PERSON_FIELDS.firstName.maxLength, {
    message: `Los nombres no pueden tener más de ${PERSON_FIELDS.firstName.maxLength} caracteres`,
  })
  firstName!: string;

  @ApiProperty({
    maxLength: PERSON_FIELDS.lastName.maxLength,
    description: 'Apellidos de la persona.',
    example: 'Pérez García',
  })
  @Trim()
  @IsDefined({ message: 'Los apellidos son obligatorios' })
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los apellidos no pueden estar vacíos' })
  @MaxLength(PERSON_FIELDS.lastName.maxLength, {
    message: `Los apellidos no pueden tener más de ${PERSON_FIELDS.lastName.maxLength} caracteres`,
  })
  lastName!: string;

  @ApiPropertyOptional({
    nullable: true,
    maxLength: PERSON_FIELDS.email.maxLength,
    description: 'Correo electrónico personal.',
    example: 'juan.perez@example.com',
  })
  @TrimOptional()
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @MaxLength(PERSON_FIELDS.email.maxLength, {
    message: `El correo electrónico no puede tener más de ${PERSON_FIELDS.email.maxLength} caracteres`,
  })
  email?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    maxLength: PERSON_FIELDS.phone.maxLength,
    description: 'Número telefónico de la persona.',
    example: '987654321',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MaxLength(PERSON_FIELDS.phone.maxLength, {
    message: `El teléfono no puede tener más de ${PERSON_FIELDS.phone.maxLength} caracteres`,
  })
  phone?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
    format: 'date',
    description: 'Fecha de nacimiento en formato YYYY-MM-DD.',
    example: '2000-05-15',
  })
  @IsOptional()
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
