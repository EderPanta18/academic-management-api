// modules/course-offerings/presentation/dtos/query/list-course-offerings-query.dto.ts

import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import { PaginationQueryDto } from '@shared/dtos';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';

export class ListCourseOfferingsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsInt({ message: 'El id del curso debe ser un número entero' })
  @IsPositive({ message: 'El id del curso debe ser positivo' })
  @Type(() => Number)
  courseId?: number;

  @IsOptional()
  @IsInt({ message: 'El id del período debe ser un número entero' })
  @IsPositive({ message: 'El id del período debe ser positivo' })
  @Type(() => Number)
  academicPeriodId?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(CourseOfferingStatus, {
    each: true,
    message: (args) =>
      `Estado inválido: '${args.value}'. Debe ser uno de: ${Object.values(CourseOfferingStatus).join(', ')}`,
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
  status?: CourseOfferingStatus[];
}
