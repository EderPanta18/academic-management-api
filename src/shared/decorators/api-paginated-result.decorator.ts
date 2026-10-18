import { PAGINATION_LIMIT, PAGINATION_PAGE } from '@core/pagination';
import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';

function ApiPaginationQueryParams(): MethodDecorator {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número de página.',
      default: PAGINATION_PAGE.default,
      example: PAGINATION_PAGE.default,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Registros por página.',
      default: PAGINATION_LIMIT.default,
      example: PAGINATION_LIMIT.default,
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
              description: 'Página actual.',
              example: 1,
            },
            limit: {
              type: 'number',
              description: 'Registros por página.',
              example: 20,
            },
            totalItems: {
              type: 'number',
              description: 'Total de registros encontrados.',
              example: 50,
            },
            totalPages: {
              type: 'number',
              description: 'Total de páginas.',
              example: 3,
            },
            hasNextPage: {
              type: 'boolean',
              description: 'Indica si existe una página siguiente.',
              example: true,
            },
            hasPreviousPage: {
              type: 'boolean',
              description: 'Indica si existe una página anterior.',
              example: false,
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
