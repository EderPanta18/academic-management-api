import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@shared/decorators';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { COURSE_OFFERING_FIELDS } from './course-offering-fields.constants';

export class CreateCourseOfferingRequestDto {
  @ApiProperty({
    description: 'ID del curso del catálogo.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsDefined({ message: 'El ID del curso es obligatorio' })
  @IsUUID('4', { message: 'El ID del curso debe ser un UUID válido' })
  courseId!: string;

  @ApiProperty({
    description: 'ID del período académico.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsDefined({ message: 'El ID del período académico es obligatorio' })
  @IsUUID('4', { message: 'El ID del período académico debe ser un UUID válido' })
  academicPeriodId!: string;

  @ApiPropertyOptional({
    description: 'ID del profesor a asignar.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del profesor debe ser un UUID válido' })
  professorId?: string;

  @ApiProperty({
    description: 'Sección de la oferta.',
    example: 'A',
  })
  @Trim()
  @IsDefined({ message: 'La sección es obligatoria' })
  @IsString({ message: 'La sección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La sección no puede estar vacía' })
  @MinLength(COURSE_OFFERING_FIELDS.section.minLength, {
    message: `La sección debe tener al menos ${COURSE_OFFERING_FIELDS.section.minLength} caracteres`,
  })
  @MaxLength(COURSE_OFFERING_FIELDS.section.maxLength, {
    message: `La sección no puede tener más de ${COURSE_OFFERING_FIELDS.section.maxLength} caracteres`,
  })
  @Matches(COURSE_OFFERING_FIELDS.section.pattern, {
    message: 'La sección solo puede contener mayúsculas, números y guiones',
  })
  section!: string;

  @ApiProperty({
    description: 'Cupo máximo de la oferta.',
    example: 40,
    minimum: COURSE_OFFERING_FIELDS.maxCapacity.min,
    maximum: COURSE_OFFERING_FIELDS.maxCapacity.max,
  })
  @IsDefined({ message: 'El cupo máximo es obligatorio' })
  @Type(() => Number)
  @IsInt({ message: 'El cupo máximo debe ser un número entero' })
  @Min(COURSE_OFFERING_FIELDS.maxCapacity.min, {
    message: `El cupo máximo debe ser al menos ${COURSE_OFFERING_FIELDS.maxCapacity.min}`,
  })
  @Max(COURSE_OFFERING_FIELDS.maxCapacity.max, {
    message: `El cupo máximo no puede exceder ${COURSE_OFFERING_FIELDS.maxCapacity.max}`,
  })
  maxCapacity!: number;

  @ApiPropertyOptional({
    description: 'Cupo disponible inicial (opcional).',
    example: 40,
    minimum: COURSE_OFFERING_FIELDS.availableCapacity.min,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El cupo disponible debe ser un número entero' })
  @Min(COURSE_OFFERING_FIELDS.availableCapacity.min, {
    message: `El cupo disponible no puede ser negativo`,
  })
  availableCapacity?: number;
}
