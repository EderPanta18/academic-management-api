// modules/students/application/use-cases/bulk-import-students.use-case.ts

import { DomainException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import type { BulkResult, BulkRowError } from '@shared/types';
import { type BulkImportStudentsCommand, CreateStudentCommand } from '../commands';
import type { CreateStudentUseCase } from './create-student.use-case';

@Injectable()
export class BulkImportStudentsUseCase {
  constructor(private readonly createUseCase: CreateStudentUseCase) {}

  async execute(command: BulkImportStudentsCommand): Promise<BulkResult> {
    const errors: BulkRowError[] = [...command.preErrors];

    for (const row of command.validRows) {
      try {
        await this.createUseCase.execute(
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
          error instanceof DomainException ? error.message : 'Error inesperado al procesar la fila';

        errors.push({
          row: row.rowNumber,
          field: 'general',
          reason,
        });
      }
    }

    const totalFailed = new Set(errors.map((error) => error.row)).size;
    const totalSuccess = Math.max(command.totalRows - totalFailed, 0);

    return {
      totalRows: command.totalRows,
      totalSuccess,
      totalFailed,
      errors,
    };
  }
}
