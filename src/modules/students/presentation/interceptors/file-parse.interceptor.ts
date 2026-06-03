// modules/students/presentation/interceptors/file-parse.interceptor.ts

import * as path from 'node:path';
import {
  BadRequestException,
  type CallHandler,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { FILE_PARSER_PORT, type IFileParser } from '@platform/files/parser';
import type { BulkRowError } from '@shared/types';
import type { StudentRowInput } from '@students/application/commands';
import { STUDENT_BULK_IMPORT } from '@students/presentation/constants';
import { StudentImportHttpMapper } from '@students/presentation/mappers';
import { validateSync } from 'class-validator';
import type { Request } from 'express';
import { Observable } from 'rxjs';

export interface ParsedImportData {
  validRows: StudentRowInput[];
  preErrors: BulkRowError[];
  totalRows: number;
}

type ReqWithImport = Request & {
  file?: Express.Multer.File;
  importData?: ParsedImportData;
};

@Injectable()
export class FileParseInterceptor implements NestInterceptor {
  constructor(
    @Inject(FILE_PARSER_PORT)
    private readonly parser: IFileParser,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<ReqWithImport>();
    const file = req.file;

    if (!file)
      throw new BadRequestException(
        'Se requiere un archivo. Envía el campo "file" como multipart/form-data',
      );

    const ext = path.extname(file.originalname).toLowerCase();

    if (!(STUDENT_BULK_IMPORT.ALLOWED_EXTENSIONS as readonly string[]).includes(ext))
      throw new BadRequestException(
        `Extensión no soportada: "${ext}". Use: ${STUDENT_BULK_IMPORT.ALLOWED_EXTENSIONS.join(', ')}`,
      );

    let rawRows: Record<string, unknown>[];

    try {
      rawRows = this.parser.parse(file.buffer, ext);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al parsear el archivo';

      throw new BadRequestException(message);
    }

    if (rawRows.length < STUDENT_BULK_IMPORT.MIN_ROWS)
      throw new BadRequestException('El archivo no contiene filas de datos');

    if (rawRows.length > STUDENT_BULK_IMPORT.MAX_ROWS)
      throw new BadRequestException(
        `El archivo supera el límite de ${STUDENT_BULK_IMPORT.MAX_ROWS} filas (recibidas: ${rawRows.length})`,
      );

    const validRows: StudentRowInput[] = [];
    const preErrors: BulkRowError[] = [];

    for (let i = 0; i < rawRows.length; i++) {
      const rowNumber = i + 2;
      const dto = StudentImportHttpMapper.toDto(rawRows[i]);

      const errors = validateSync(dto, {
        whitelist: true,
        forbidUnknownValues: false,
      });

      if (errors.length > 0) {
        errors.forEach((error) => {
          const reason = Object.values(error.constraints ?? {}).join('; ');

          preErrors.push({
            row: rowNumber,
            field: error.property,
            reason,
          });
        });

        continue;
      }

      validRows.push(StudentImportHttpMapper.toInput(dto, rowNumber));
    }

    req.importData = {
      validRows,
      preErrors,
      totalRows: rawRows.length,
    };

    return next.handle();
  }
}
