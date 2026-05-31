// modules/students/presentation/interceptors/file-parse.interceptor.ts

import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { validateSync } from 'class-validator';
import { type Request } from 'express';
import * as path from 'path';
import { type Observable } from 'rxjs';
import { BULK_IMPORT } from '@students/presentation/constants';
import { BulkRowErrorDto } from '@shared/dtos';
import {
  FILE_PARSER_PORT,
  type IFileParser,
} from '@platform/files/parser';
import { type StudentRowInput } from '@students/application/commands';
import { StudentImportHttpMapper } from '@students/presentation/mappers';

export interface ParsedImportData {
  validRows: StudentRowInput[];
  preErrors: BulkRowErrorDto[];
  totalInFile: number;
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

    if (!file) {
      throw new BadRequestException(
        'Se requiere un archivo. Envía el campo "file" como multipart/form-data',
      );
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!(BULK_IMPORT.ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
      throw new BadRequestException(
        `Extensión no soportada: "${ext}". Use: ${BULK_IMPORT.ALLOWED_EXTENSIONS.join(', ')}`,
      );
    }

    let rawRows: Record<string, unknown>[];
    try {
      rawRows = this.parser.parse(file.buffer, ext);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Error al parsear el archivo';
      throw new BadRequestException(msg);
    }

    if (rawRows.length < BULK_IMPORT.MIN_ROWS) {
      throw new BadRequestException('El archivo no contiene filas de datos');
    }
    if (rawRows.length > BULK_IMPORT.MAX_ROWS) {
      throw new BadRequestException(
        `El archivo supera el límite de ${BULK_IMPORT.MAX_ROWS} filas (recibidas: ${rawRows.length})`,
      );
    }

    const validRows: StudentRowInput[] = [];
    const preErrors: BulkRowErrorDto[] = [];

    for (let i = 0; i < rawRows.length; i++) {
      const rowNumber = i + 2;
      const dto = StudentImportHttpMapper.toDto(rawRows[i]);
      const errors = validateSync(dto, {
        whitelist: true,
        forbidUnknownValues: false,
      });

      if (errors.length > 0) {
        errors.forEach((err) => {
          const reason = Object.values(err.constraints ?? {}).join('; ');
          preErrors.push(BulkRowErrorDto.from(rowNumber, err.property, reason));
        });
      } else {
        validRows.push(StudentImportHttpMapper.toInput(dto, rowNumber));
      }
    }

    req.importData = { validRows, preErrors, totalInFile: rawRows.length };
    return next.handle();
  }
}
