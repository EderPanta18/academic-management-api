// modules/students/application/use-cases/bulk-import-students.use-case.ts

import { Injectable } from '@nestjs/common';
import { BulkRowErrorDto, BulkResultDto } from '@shared/application/dtos';
import { DomainException } from '@shared/domain/exceptions';
import { BulkImportStudentsCommand, CreateStudentCommand } from '../commands';
import { CreateStudentUseCase } from './create-student.use-case';

@Injectable()
export class BulkImportStudentsUseCase {
  constructor(private readonly createStudentUseCase: CreateStudentUseCase) {}

  async execute(command: BulkImportStudentsCommand): Promise<BulkResultDto> {
    // Parte con errores estructurales ya recolectados por el interceptor
    const errors: BulkRowErrorDto[] = [...command.preErrors];

    for (const row of command.validRows) {
      try {
        await this.createStudentUseCase.execute(
          new CreateStudentCommand({
            firstName: row.firstName,
            lastName: row.lastName,
            dni: row.dni,
            email: row.email,
            code: row.code,
            careerId: row.careerId,
            enrollmentDate: new Date(row.enrollmentDate),
            institutionalEmail: row.institutionalEmail,
            phone: row.phone,
            birthDate: row.birthDate ? new Date(row.birthDate) : undefined,
          }),
        );
      } catch (error) {
        const reason =
          error instanceof DomainException
            ? error.message
            : 'Error inesperado al procesar la fila';
        errors.push(BulkRowErrorDto.from(row.rowNumber, '', reason));
      }
    }

    return BulkResultDto.from(command.totalInFile, errors);
  }
}
