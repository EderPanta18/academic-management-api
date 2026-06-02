// shared/decorators/api-paginated-operation.decorator.ts

import { applyDecorators, type Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath
} from "@nestjs/swagger";

const ApiPaginationQueries = (): MethodDecorator =>
  applyDecorators(
    ApiQuery({
      name: "page",
      required: false,
      type: Number,
      example: 1,
      description: "Número de página"
    }),
    ApiQuery({
      name: "pageSize",
      required: false,
      type: Number,
      example: 20,
      description: "Registros por página"
    })
  );

const ApiPaginatedOkResponse = <T extends Type<unknown>>(
  model: T
): MethodDecorator =>
  ApiOkResponse({
    schema: {
      properties: {
        items: {
          type: "array",
          items: { $ref: getSchemaPath(model) }
        },
        total: {
          type: "number",
          example: 50,
          description: "Total de registros encontrados"
        },
        page: {
          type: "number",
          example: 1,
          description: "Página actual"
        },
        pageSize: {
          type: "number",
          example: 20,
          description: "Registros por página"
        },
        hasNextPage: {
          type: "boolean",
          example: true,
          description: "Indica si existe una página siguiente"
        }
      }
    }
  });

export const ApiPaginatedOperation = <T extends Type<unknown>>(
  model: T
): MethodDecorator =>
  applyDecorators(
    ApiPaginationQueries(),
    ApiExtraModels(model),
    ApiPaginatedOkResponse(model)
  );
