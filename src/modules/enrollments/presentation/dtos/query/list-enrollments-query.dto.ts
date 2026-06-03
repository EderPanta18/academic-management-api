// modules/enrollments/presentation/dtos/query/list-enrollments-query.dto.ts

import { EnrollmentStatus } from '@enrollments/domain/constants';
import { PaginationQueryDto } from '@shared/dtos';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';

export class ListEnrollmentsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El id del alumno debe ser un número entero' })
  @IsPositive({ message: 'El id del alumno debe ser positivo' })
  studentId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El id de la oferta debe ser un número entero' })
  @IsPositive({ message: 'El id de la oferta debe ser positivo' })
  courseOfferingId?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(EnrollmentStatus, {
    each: true,
    message: (args) =>
      `Estado inválido: '${args.value}'. Debe ser uno de: ${Object.values(EnrollmentStatus).join(', ')}`,
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
  status?: EnrollmentStatus[];
}
