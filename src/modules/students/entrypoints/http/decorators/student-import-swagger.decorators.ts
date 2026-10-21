import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiStartStudentImport() {
  return applyDecorators(
    ApiOperation({
      summary: 'Iniciar importación masiva de estudiantes (Asíncrono)',
    }),
    HttpCode(HttpStatus.ACCEPTED),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Archivo a procesar.',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.ACCEPTED,
      description: 'Archivo recibido y encolado para procesamiento.',
      schema: {
        type: 'object',
        properties: {
          importId: {
            type: 'string',
            format: 'uuid',
            example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'El archivo no cumple con el formato, extensión o tamaño permitido.',
    }),
    ApiNotFoundResponse({
      description: 'El usuario creador no existe en el sistema.',
    }),
    ApiConflictResponse({
      description: 'El archivo ya fue importado previamente por este usuario.',
    }),
  );
}
