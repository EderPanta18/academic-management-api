// src/shared/decorators/api-paginated-result.decorator.ts

import { PAGINATION_LIMIT, PAGINATION_PAGE } from '@core/pagination';
import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';

function ApiPaginationQueryParameters(): MethodDecorator {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: 'integer',
      minimum: PAGINATION_PAGE.range.min,
      default: PAGINATION_PAGE.default,
      description: 'Número de página.',
      example: PAGINATION_PAGE.default,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: 'integer',
      minimum: PAGINATION_LIMIT.range.min,
      maximum: PAGINATION_LIMIT.range.max,
      default: PAGINATION_LIMIT.default,
      description: 'Cantidad de registros por página.',
      example: PAGINATION_LIMIT.default,
    }),
  );
}

function ApiPaginatedDataResponse<T extends Type<unknown>>(model: T): MethodDecorator {
  return ApiOkResponse({
    schema: {
      type: 'object',
      required: ['items', 'meta'],
      properties: {
        items: {
          type: 'array',
          items: { $ref: getSchemaPath(model) },
        },
        meta: {
          type: 'object',
          required: ['page', 'limit', 'totalItems', 'totalPages', 'hasNextPage', 'hasPreviousPage'],
          properties: {
            page: {
              type: 'integer',
              minimum: PAGINATION_PAGE.range.min,
              description: 'Página solicitada.',
              example: PAGINATION_PAGE.default,
            },
            limit: {
              type: 'integer',
              minimum: PAGINATION_LIMIT.range.min,
              maximum: PAGINATION_LIMIT.range.max,
              description: 'Cantidad de registros por página.',
              example: PAGINATION_LIMIT.default,
            },
            totalItems: {
              type: 'integer',
              minimum: 0,
              description: 'Total de registros que cumplen los filtros.',
              example: 50,
            },
            totalPages: {
              type: 'integer',
              minimum: 0,
              description: 'Total de páginas disponibles.',
              example: 3,
            },
            hasNextPage: {
              type: 'boolean',
              description: 'Indica si existen registros en páginas posteriores.',
              example: true,
            },
            hasPreviousPage: {
              type: 'boolean',
              description: 'Indica si existe una posición de página anterior.',
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
    ApiPaginationQueryParameters(),
    ApiExtraModels(model),
    ApiPaginatedDataResponse(model),
  );
}
