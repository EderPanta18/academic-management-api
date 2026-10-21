import { EnrollmentStatus } from '@enrollments/domain/entities';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class ListEnrollmentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID del estudiante.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del estudiante debe ser un UUID válido' })
  studentId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de la oferta de curso.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la oferta debe ser un UUID válido' })
  courseOfferingId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID del período académico.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del período debe ser un UUID válido' })
  academicPeriodId?: string;

  @ApiPropertyOptional({
    enum: EnrollmentStatus,
    isArray: true,
    description: 'Filtrar por uno o más estados.',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(EnrollmentStatus, {
    each: true,
    message: `Cada estado debe ser uno de: ${Object.values(EnrollmentStatus).join(', ')}`,
  })
  @Transform(({ value }) => {
    if (!value) return undefined;

    const rawValues = Array.isArray(value)
      ? value
      : String(value)
          .split(',')
          .map((v) => v.trim());

    return rawValues.map((v) => String(v).toUpperCase());
  })
  statuses?: EnrollmentStatus[];

  @ApiPropertyOptional({
    description:
      'Búsqueda global (código del estudiante, nombres, apellidos, código/nombre del curso, código del período).',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;
}
