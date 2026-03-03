// modules/students/presentation/mappers/student-import-http.mapper.ts

import { plainToInstance } from 'class-transformer';
import { BulkResultDto } from '@shared/application/dtos';
import { type StudentRowInput } from '@students/application/commands';
import { StudentImportRowDto, BulkImportResultResponseDto } from '../dtos';

export class StudentImportHttpMapper {
  static toDto(raw: Record<string, unknown>): StudentImportRowDto {
    return plainToInstance(StudentImportRowDto, raw, {
      enableImplicitConversion: false,
      exposeUnsetFields: false,
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
      careerId: dto.careerId,
      enrollmentDate: dto.fechaMatricula,
      institutionalEmail: dto.emailInstitucional,
      phone: dto.telefono,
      birthDate: dto.fechaNacimiento,
    };
  }

  static toResponse(result: BulkResultDto): BulkImportResultResponseDto {
    const dto = new BulkImportResultResponseDto();
    dto.totalProcessed = result.totalProcessed;
    dto.totalSuccess = result.totalSuccess;
    dto.totalFailed = result.totalFailed;
    dto.errors = result.errors.map((e) => ({
      row: e.row,
      field: e.field,
      reason: e.reason,
    }));
    return dto;
  }
}
