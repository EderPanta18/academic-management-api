import * as path from 'node:path';
import { type FieldError, ValidationException } from '@core/exceptions';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { STUDENT_IMPORT_UPLOAD } from '../constants';

@Injectable()
export class StudentImportUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const file = req.file as Express.Multer.File | undefined;

    // Si no hay archivo, es el único error posible y cortamos aquí.
    if (!file)
      throw new ValidationException('El archivo es obligatorio.', [
        { field: 'file', messages: ['Se requiere un archivo en el campo "file".'] },
      ]);

    const errors: FieldError[] = [];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!STUDENT_IMPORT_UPLOAD.ALLOWED_EXTENSIONS.includes(ext as never))
      errors.push({
        field: 'file',
        messages: [
          `Extensión no permitida. Use: ${STUDENT_IMPORT_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`,
        ],
      });

    if (!STUDENT_IMPORT_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype as never))
      errors.push({
        field: 'file',
        messages: ['Tipo de archivo no permitido.'],
      });

    if (file.size > STUDENT_IMPORT_UPLOAD.MAX_FILE_SIZE_BYTES)
      errors.push({
        field: 'file',
        messages: [
          `El archivo excede el tamaño máximo permitido (${STUDENT_IMPORT_UPLOAD.MAX_FILE_SIZE_BYTES}Bytes).`,
        ],
      });

    if (errors.length > 0)
      throw new ValidationException('El archivo enviado no es válido.', errors);

    return next.handle();
  }
}
