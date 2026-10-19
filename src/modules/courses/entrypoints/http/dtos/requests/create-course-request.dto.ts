import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim, TrimOptional } from '@shared/decorators';
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
} from 'class-validator';
import { COURSE_FIELDS } from './course-fields.constants';

export class CreateCourseRequestDto {
  @ApiProperty({
    description: 'ID del programa académico al que pertenece el curso.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsDefined({ message: 'El ID del programa académico es obligatorio' })
  @IsUUID('4', { message: 'El ID del programa académico debe ser un UUID válido' })
  academicProgramId!: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría del curso.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  courseCategoryId?: string;

  @ApiProperty({
    description: 'Código del curso, único dentro del programa académico.',
    example: 'CS-101',
  })
  @Trim()
  @IsDefined({ message: 'El código del curso es obligatorio' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código no puede estar vacío' })
  @MaxLength(COURSE_FIELDS.code.maxLength, {
    message: `El código no puede tener más de ${COURSE_FIELDS.code.maxLength} caracteres`,
  })
  @Matches(COURSE_FIELDS.code.pattern, {
    message: 'El código solo puede contener mayúsculas, números y guiones',
  })
  code!: string;

  @ApiProperty({
    description: 'Nombre del curso.',
    example: 'Fundamentos de Programación',
  })
  @Trim()
  @IsDefined({ message: 'El nombre del curso es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(COURSE_FIELDS.name.maxLength, {
    message: `El nombre no puede tener más de ${COURSE_FIELDS.name.maxLength} caracteres`,
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Descripción del contenido y objetivos del curso.',
    example: 'Fundamentos de modelado relacional y SQL',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(COURSE_FIELDS.description.maxLength, {
    message: `La descripción no puede tener más de ${COURSE_FIELDS.description.maxLength} caracteres`,
  })
  description?: string;

  @ApiProperty({
    description: 'Créditos académicos del curso.',
    example: 4,
    minimum: COURSE_FIELDS.credits.min,
    maximum: COURSE_FIELDS.credits.max,
  })
  @IsDefined({ message: 'Los créditos son obligatorios' })
  @Type(() => Number)
  @IsInt({ message: 'Los créditos deben ser un número entero' })
  @Min(COURSE_FIELDS.credits.min, {
    message: `Los créditos deben ser al menos ${COURSE_FIELDS.credits.min}`,
  })
  @Max(COURSE_FIELDS.credits.max, {
    message: `Los créditos no pueden exceder ${COURSE_FIELDS.credits.max}`,
  })
  credits!: number;

  @ApiPropertyOptional({
    description: 'Horas académicas del curso.',
    example: 64,
    minimum: COURSE_FIELDS.hours.min,
    maximum: COURSE_FIELDS.hours.max,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Las horas deben ser un número entero' })
  @Min(COURSE_FIELDS.hours.min, {
    message: `Las horas deben ser al menos ${COURSE_FIELDS.hours.min}`,
  })
  @Max(COURSE_FIELDS.hours.max, {
    message: `Las horas no pueden exceder ${COURSE_FIELDS.hours.max}`,
  })
  hours?: number;
}
