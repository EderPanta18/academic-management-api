import { CourseOfferingStatus } from '@course-offerings/domain/entities';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class ListCourseOfferingsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID del curso.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del curso debe ser un UUID válido' })
  courseId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID del período académico.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del período académico debe ser un UUID válido' })
  academicPeriodId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID del profesor asignado.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del profesor debe ser un UUID válido' })
  professorId?: string;

  @ApiPropertyOptional({
    enum: CourseOfferingStatus,
    isArray: true,
    description: 'Filtrar por uno o más estados.',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CourseOfferingStatus, {
    each: true,
    message: `Cada estado debe ser uno de: ${Object.values(CourseOfferingStatus).join(', ')}`,
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
  statuses?: CourseOfferingStatus[];

  @ApiPropertyOptional({
    description: 'Búsqueda global (código/nombre del curso, código del período, sección).',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;
}
