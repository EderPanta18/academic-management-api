// shared/presentation/decorators/api-paginated-response.decorator.ts

import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResultDto } from '@shared/application/dtos';

export const ApiPaginatedResponse = () =>
  applyDecorators(
    ApiExtraModels(PaginatedResultDto),
    HttpCode(HttpStatus.OK),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              statusCode: {
                type: 'number',
                example: 200,
              },
              data: {
                $ref: getSchemaPath(PaginatedResultDto),
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2026-02-24T22:00:00.000Z',
              },
              path: {
                type: 'string',
                example: '/api/v1/professors',
              },
            },
          },
          {
            properties: {
              data: {
                $ref: getSchemaPath(PaginatedResultDto),
              },
            },
          },
        ],
      },
    }),
  );
