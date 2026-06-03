// modules/students/presentation/mappers/student-import-http.mapper.ts

import { plainToInstance } from "class-transformer";

import type { BulkResult } from "@shared/types";
import type { StudentRowInput } from "@students/application/commands";
import { StudentImportRowDto, BulkImportResultResponseDto } from "../dtos";

export class StudentImportHttpMapper {
  static toDto(raw: Record<string, unknown>): StudentImportRowDto {
    return plainToInstance(StudentImportRowDto, raw, {
      enableImplicitConversion: false,
      exposeUnsetFields: false
    });
  }

  static toInput(dto: StudentImportRowDto, rowNumber: number): StudentRowInput {
    return {
      rowNumber,
      firstName: dto.nombres,
      lastName: dto.apellidos,
      dni: dto.dni,
      email: dto.email,
      code: dto.codigo,
      careerId: dto.carreraId,
      enrollmentDate: dto.fechaMatricula,
      institutionalEmail: dto.emailInstitucional,
      phone: dto.telefono,
      birthDate: dto.fechaNacimiento
    };
  }

  static toResponse(result: BulkResult): BulkImportResultResponseDto {
    const dto = new BulkImportResultResponseDto();

    dto.totalRows = result.totalRows;
    dto.totalSuccess = result.totalSuccess;
    dto.totalFailed = result.totalFailed;
    dto.errors = result.errors.map((error) => ({
      row: error.row,
      field: error.field,
      reason: error.reason
    }));

    return dto;
  }
}
