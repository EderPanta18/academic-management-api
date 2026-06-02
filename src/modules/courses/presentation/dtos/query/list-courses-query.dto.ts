// modules/courses/presentation/dtos/query/list-courses-query.dto.ts

import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";

import { PaginationQueryDto } from "@shared/dtos";

export class ListCoursesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsInt({ message: "El id de la carrera debe ser un número entero" })
  @IsPositive({ message: "El id de la carrera debe ser positivo" })
  @Type(() => Number)
  careerId?: number;

  @IsOptional()
  @IsInt({ message: "El id de la categoría debe ser un número entero" })
  @IsPositive({ message: "El id de la categoría debe ser positivo" })
  @Type(() => Number)
  categoryId?: number;
}
