// modules/students/presentation/dtos/request/create-student.dto.ts

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
import { Trim, TrimOptional } from '@shared/decorators';
import { StudentStatus } from '@students/domain/constants';

export class CreateStudentDto {
  // ── Obligatorios ──────────────────────────────────────────────────────────

  @ApiProperty({
    description: 'DNI del estudiante — 8 dígitos numéricos',
    example: '87654321',
    pattern: '^[0-9]{8}$',
  })
  @Trim()
  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'El DNI debe contener solo dígitos' })
  dni: string;

  @ApiProperty({
    description: 'Nombre del estudiante',
    example: 'María Elena',
    pattern: '^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$',
  })
  @Trim()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del estudiante',
    example: 'García Torres',
    pattern: '^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$',
  })
  @Trim()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  @MaxLength(100, {
    message: 'El apellido no puede tener más de 100 caracteres',
  })
  lastName: string;

  @ApiProperty({
    description: 'Email personal del estudiante',
    example: 'maria.garcia@gmail.com',
    format: 'email',
  })
  @Trim()
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @MaxLength(150, { message: 'El email no puede tener más de 150 caracteres' })
  email: string;

  @ApiProperty({
    description: 'ID de la carrera del estudiante',
    example: 1,
    format: 'int32',
  })
  @IsInt({ message: 'El ID de la carrera debe ser un número entero' })
  @IsPositive({ message: 'El ID de la carrera debe ser un número positivo' })
  careerId: number;

  @ApiProperty({
    description: 'Código académico del estudiante — 10 caracteres',
    example: '2024000042',
    pattern: '^[A-Z0-9]{10}$',
  })
  @Trim()
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @Length(10, 10, { message: 'El código debe tener exactamente 10 caracteres' })
  @Matches(/^[A-Z0-9]{10}$/, {
    message: 'El código solo puede contener letras mayúsculas y dígitos',
  })
  code: string;

  @ApiProperty({
    description: 'Fecha de matrícula del estudiante',
    example: '2024-03-01',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de matrícula debe ser una fecha válida' })
  enrollmentDate: Date;

  // ── Opcionales ────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Email institucional del estudiante',
    example: 'maria.garcia@universidad.edu.pe',
    format: 'email',
  })
  @TrimOptional()
  @IsOptional()
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email institucional no puede estar vacío' })
  @MaxLength(150, { message: 'El email no puede tener más de 150 caracteres' })
  institutionalEmail?: string;

  @ApiPropertyOptional({
    description: 'Estado inicial del estudiante',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StudentStatus, {
    each: true,
    message: (args) =>
      `Estado inválido: '${args.value}'. Debe ser uno de: ${Object.values(StudentStatus).join(', ')}`,
  })
  status?: StudentStatus;

  @ApiPropertyOptional({
    description: 'Número de teléfono del estudiante',
    example: '987654321',
    pattern: '^[0-9]{9}$',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^[0-9]{9}$/, {
    message: 'El teléfono debe contener exactamente 9 dígitos numéricos',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del estudiante',
    example: '2000-05-20',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate?: Date;
}
