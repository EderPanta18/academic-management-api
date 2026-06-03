// modules/courses/presentation/dtos/request/create-course.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim, TrimOptional } from '@shared/decorators';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  // ── Obligatorios ──────────────────────────────────────────────────────────

  @ApiProperty({
    description: 'Id de la carrera a la que pertenece el curso',
    example: 1,
    format: 'int32',
  })
  @IsDefined({ message: 'El id de la carrera es obligatorio' })
  @Type(() => Number)
  @IsInt({ message: 'El id de la carrera debe ser un número entero' })
  @IsPositive({ message: 'El id de la carrera debe ser positivo' })
  careerId!: number;

  @ApiProperty({
    description: 'Nombre del curso dentro de la carrera',
    example: 'Bases de Datos I',
  })
  @Trim()
  @IsDefined({ message: 'El nombre del curso es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(150, { message: 'El nombre no puede tener más de 150 caracteres' })
  name!: string;

  @ApiProperty({
    description: 'Créditos académicos del curso',
    example: 3,
    format: 'int32',
    minimum: 1,
    maximum: 4,
  })
  @IsDefined({ message: 'Los créditos son obligatorios' })
  @Type(() => Number)
  @IsInt({ message: 'Los créditos deben ser un número entero' })
  @Min(1, { message: 'Los créditos deben ser al menos 1' })
  @Max(4, { message: 'Los créditos no pueden exceder 4' })
  credits!: number;

  // ── Opcionales ────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Id de la categoría del curso',
    example: 2,
    format: 'int32',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El id de la categoría debe ser un número entero' })
  @IsPositive({ message: 'El id de la categoría debe ser positivo' })
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Descripción del contenido y objetivos del curso',
    example: 'Fundamentos de modelado relacional y SQL',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía si se envía' })
  @MaxLength(1000, {
    message: 'La descripción no puede tener más de 1000 caracteres',
  })
  description?: string;
}
