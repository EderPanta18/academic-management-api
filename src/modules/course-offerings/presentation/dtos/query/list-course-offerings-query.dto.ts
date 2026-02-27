// modules/course-offerings/presentation/dtos/query/list-course-offerings-query.dto.ts

import { IsOptional, IsEnum, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '@shared/presentation/dtos';
import { CourseOfferingStatus } from '@course-offerings/domain/constants';

export class ListCourseOfferingsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsArray()
  @IsEnum(CourseOfferingStatus, {
    each: true,
    message: (args) =>
      `Estado inválido: '${args.value}'. Debe ser uno de: ${Object.values(CourseOfferingStatus).join(', ')}`,
  })
  @Transform(({ value }) => {
    const rawValues = Array.isArray(value)
      ? value
      : String(value)
          .split(',')
          .map((v) => v.trim());

    return rawValues.map((v) => String(v).toUpperCase());
  })
  status?: CourseOfferingStatus[];
}
