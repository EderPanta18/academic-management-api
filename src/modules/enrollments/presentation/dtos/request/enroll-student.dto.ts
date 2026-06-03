// modules/enrollments/presentation/dtos/request/enroll-student.dto.ts

import { Type } from "class-transformer";
import {
  IsDate,
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EnrollStudentDto {
  // ── Obligatorios ──────────────────────────────────────────────────────────

  @ApiProperty({
    description: "Id del alumno a inscribir",
    example: 1,
    format: "int32"
  })
  @IsDefined({ message: "El id del alumno es obligatorio" })
  @Type(() => Number)
  @IsInt({ message: "El id del alumno debe ser un número entero" })
  @IsPositive({ message: "El id del alumno debe ser positivo" })
  studentId!: number;

  @ApiProperty({
    description: "Id de la oferta de curso en la que se inscribe el alumno",
    example: 3,
    format: "int32"
  })
  @IsDefined({ message: "El id de la oferta es obligatorio" })
  @Type(() => Number)
  @IsInt({ message: "El id de la oferta debe ser un número entero" })
  @IsPositive({ message: "El id de la oferta debe ser positivo" })
  courseOfferingId!: number;

  @ApiProperty({
    description: "Fecha en que se registra la matrícula",
    example: "2026-02-28",
    format: "date",
    type: String
  })
  @Type(() => Date)
  @IsDate({ message: "La fecha de matrícula debe ser una fecha válida" })
  enrollmentDate!: Date;

  // ── Opcionales ────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description:
      "Id del appuser que procesa la matrícula. " +
      "Null o ausente cuando el alumno se inscribe por autoservicio",
    example: 1,
    format: "int32",
    nullable: true,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "El id del usuario debe ser un número entero" })
  @IsPositive({ message: "El id del usuario debe ser positivo" })
  createdBy?: number;
}
