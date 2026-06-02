// modules/professors/presentation/dtos/query/list-professors-query.dto.ts

import { IsInt, IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";

import { PaginationQueryDto } from "@shared/dtos";

export class ListProfessorsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsInt({ message: "El id del departamento debe ser un número entero" })
  @IsPositive({ message: "El id del departamento debe ser positivo" })
  @Type(() => Number)
  departmentId?: number;
}
