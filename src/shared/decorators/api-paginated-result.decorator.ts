import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';

function ApiPaginationQueryParams(): MethodDecorator {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Número de página',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 20,
      description: 'Registros por página',
    }),
  );
}

function ApiPaginatedResultSchema<T extends Type<unknown>>(model: T): MethodDecorator {
  return ApiOkResponse({
    schema: {
      properties: {
        items: {
          type: 'array',
          items: { $ref: getSchemaPath(model) },
        },
        meta: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              example: 1,
              description: 'Página actual',
            },
            limit: {
              type: 'number',
              example: 20,
              description: 'Registros por página',
            },
            totalItems: {
              type: 'number',
              example: 50,
              description: 'Total de registros encontrados',
            },
            totalPages: {
              type: 'number',
              example: 3,
              description: 'Total de páginas',
            },
            hasNextPage: {
              type: 'boolean',
              example: true,
              description: 'Indica si existe una página siguiente',
            },
            hasPreviousPage: {
              type: 'boolean',
              example: false,
              description: 'Indica si existe una página anterior',
            },
          },
        },
      },
    },
  });
}

export function ApiPaginatedResult<T extends Type<unknown>>(model: T): MethodDecorator {
  return applyDecorators(
    ApiPaginationQueryParams(),
    ApiExtraModels(model),
    ApiPaginatedResultSchema(model),
  );
}
