// modules/course-offerings/presentation/dtos/request/create-course-offering.dto.ts

import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/presentation/decorators';

export class CreateCourseOfferingDto {
  // ── Obligatorios ──────────────────────────────────────────────────────────

  @ApiProperty({
    description: 'ID del curso del catálogo',
    example: 1,
    format: 'int32',
  })
  @IsInt({ message: 'El ID del curso debe ser un número entero' })
  @IsPositive({ message: 'El ID del curso debe ser positivo' })
  courseId: number;

  @ApiProperty({
    description: 'ID del período académico',
    example: 1,
    format: 'int32',
  })
  @IsInt({ message: 'El ID del período debe ser un número entero' })
  @IsPositive({ message: 'El ID del período debe ser positivo' })
  academicPeriodId: number;

  // ── Opcionales ────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'ID del profesor (opcional al crear)',
    example: 5,
    format: 'int32',
  })
  @IsOptional()
  @IsInt({ message: 'El ID del profesor debe ser un número entero' })
  @IsPositive({ message: 'El ID del profesor debe ser positivo' })
  professorId?: number;

  @ApiPropertyOptional({
    description: 'Sección del curso',
    example: 'B',
    default: 'A',
    pattern: '^[A-Z0-9]{1,10}$',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La sección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La sección no puede estar vacía' })
  @MaxLength(10, { message: 'La sección no puede tener más de 10 caracteres' })
  @Matches(/^[A-Z0-9]{1,10}$/, {
    message: 'La sección debe contener solo letras mayúsculas y números',
  })
  section?: string;

  @ApiPropertyOptional({
    description: 'Cupos máximos permitidos',
    example: 35,
    format: 'int32',
    default: 30,
    minimum: 10,
    maximum: 40,
  })
  @IsOptional()
  @IsInt({ message: 'Los cupos deben ser un número entero' })
  @Min(10, { message: 'Los cupos deben ser al menos 10' })
  @Max(40, { message: 'Los cupos no pueden exceder 40' })
  maxStudents?: number;

  @ApiPropertyOptional({
    description: 'Fecha límite de inscripción',
    example: '2026-04-15',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  enrollmentDeadline?: Date;
}
