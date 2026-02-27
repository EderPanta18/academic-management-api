// modules/professors/presentation/dtos/request/create-professor.dto.ts

import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfessorStatus } from '@professors/domain/constants';

export class CreateProfessorDto {
  // ── Obligatorios ──────────────────────────────────────────────────────────

  @ApiProperty({
    description: 'DNI del profesor — 8 dígitos numéricos',
    example: '12345678',
    pattern: '^[0-9]{8}$',
  })
  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'El DNI debe contener solo dígitos' })
  dni: string;

  @ApiProperty({
    description: 'Nombre del profesor',
    example: 'Juan Carlos',
    pattern: '^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del profesor',
    example: 'Pérez López',
    pattern: '^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$',
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  @MaxLength(100, {
    message: 'El apellido no puede tener más de 100 caracteres',
  })
  lastName: string;

  @ApiProperty({
    description: 'Email personal del profesor',
    example: 'juan.perez@gmail.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @MaxLength(150, { message: 'El email no puede tener más de 150 caracteres' })
  email: string;

  @ApiProperty({
    description: 'Código único del profesor',
    example: 'PROF-001',
    pattern: '^[A-Z]{4}-\\d{3}$',
  })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código no puede estar vacío' })
  @MaxLength(20, { message: 'El código no puede tener más de 20 caracteres' })
  code: string;

  // ── Opcionales ────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'ID del departamento del profesor',
    example: 1,
    format: 'int32',
  })
  @IsOptional()
  @IsInt({ message: 'El ID del departamento debe ser un número entero' })
  @IsPositive({ message: 'El ID del departamento debe ser un número positivo' })
  departmentId?: number;

  @ApiPropertyOptional({
    description: 'Especialidad del profesor',
    example: 'Bases de Datos',
    pattern: '^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$',
  })
  @IsOptional()
  @IsString({ message: 'La especialidad debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La especialidad no puede estar vacía' })
  @MaxLength(100, {
    message: 'La especialidad no puede tener más de 100 caracteres',
  })
  specialty?: string;

  @ApiPropertyOptional({
    description: 'Email institucional del profesor',
    example: 'juan.perez@universidad.edu.pe',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  })
  @IsOptional()
  @IsString({ message: 'El email institucional debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El email institucional no puede estar vacío' })
  @MaxLength(150, {
    message: 'El email institucional no puede tener más de 150 caracteres',
  })
  institutionalEmail?: string;

  @ApiPropertyOptional({
    description: 'Fecha de contratación del profesor',
    example: '2024-03-01',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de contratación debe ser una fecha válida' })
  hireDate?: Date;

  @ApiPropertyOptional({
    description: 'Estado inicial del profesor',
    enum: ProfessorStatus,
    default: ProfessorStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProfessorStatus, {
    each: true,
    message: (args) =>
      `Estado inválido: '${args.value}'. Debe ser uno de: ${Object.values(ProfessorStatus).join(', ')}`,
  })
  status?: ProfessorStatus;

  @ApiPropertyOptional({
    description: 'Número de teléfono del profesor',
    example: '987654321',
    pattern: '^[0-9]{9}$',
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^[0-9]{9}$/, {
    message: 'El teléfono debe contener exactamente 9 dígitos numéricos',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del profesor',
    example: '1985-06-15',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate?: Date;
}
