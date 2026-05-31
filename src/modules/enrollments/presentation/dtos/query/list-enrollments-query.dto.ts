// modules/enrollments/presentation/dtos/query/list-enrollments-query.dto.ts

import {
  IsOptional,
  IsInt,
  IsPositive,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationQueryDto } from '@shared/dtos';
import { EnrollmentStatus } from '@enrollments/domain/constants';

export class ListEnrollmentsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsInt({ message: 'El id del alumno debe ser un número entero' })
  @IsPositive({ message: 'El id del alumno debe ser positivo' })
  @Type(() => Number)
  studentId?: number;

  @IsOptional()
  @IsInt({ message: 'El id de la oferta debe ser un número entero' })
  @IsPositive({ message: 'El id de la oferta debe ser positivo' })
  @Type(() => Number)
  courseOfferingId?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(EnrollmentStatus, {
    each: true,
    message: (args) =>
      `Estado inválido: '${args.value}'. Debe ser uno de: ${Object.values(EnrollmentStatus).join(', ')}`,
  })
  @Transform(({ value }) => {
    const rawValues = Array.isArray(value)
      ? value
      : String(value)
          .split(',')
          .map((v) => v.trim());

    return rawValues.map((v) => String(v).toUpperCase());
  })
  status?: EnrollmentStatus[];
}
