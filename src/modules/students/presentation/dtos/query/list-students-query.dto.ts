// modules/students/presentation/dtos/query/list-students-query.dto.ts

import { IsInt, IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";

import { PaginationQueryDto } from "@shared/dtos";

export class ListStudentsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsInt({ message: "El id de la carrera debe ser un número entero" })
  @IsPositive({ message: "El id de la carrera debe ser positivo" })
  @Type(() => Number)
  careerId?: number;
}
