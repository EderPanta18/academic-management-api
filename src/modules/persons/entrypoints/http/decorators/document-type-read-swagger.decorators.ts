// src/modules/persons/entrypoints/http/decorators/document-type-read-swagger.decorators.ts

import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DocumentTypeReadModelResponseDto } from '../dtos';

export function ApiListDocumentTypes(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Listar tipos de documento' }),
    ApiOkResponse({
      type: DocumentTypeReadModelResponseDto,
      isArray: true,
      description: 'Listado de tipos de documento disponibles.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para consultar tipos de documento.',
    }),
  );
}
