import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiPaginatedOperation = <T extends Type<unknown>>(model: T) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Numero de pagina',
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      example: 20,
      description: 'Registros por pagina (max. 100)',
    }),
    ApiOkResponse({
      schema: {
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          total: {
            type: 'number',
            example: 50,
            description: 'Total de registros encontrados',
          },
          page: {
            type: 'number',
            example: 1,
            description: 'Pagina actual',
          },
          pageSize: {
            type: 'number',
            example: 20,
            description: 'Registros por pagina',
          },
          hasNextPage: {
            type: 'boolean',
            example: true,
            description: 'Indica si existe una pagina siguiente',
          },
        },
      },
    }),
  );

