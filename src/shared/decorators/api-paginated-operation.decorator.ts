// shared/decorators/api-paginated-operation.decorator.ts

import { applyDecorators, type Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath
} from "@nestjs/swagger";

function ApiPaginationQueries(): MethodDecorator {
  return applyDecorators(
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
}

function ApiPaginatedOkResponse<T extends Type<unknown>>(
  model: T
): MethodDecorator {
  return ApiOkResponse({
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
}

export function ApiPaginatedOperation<T extends Type<unknown>>(
  model: T
): MethodDecorator {
  return applyDecorators(
    ApiPaginationQueries(),
    ApiExtraModels(model),
    ApiPaginatedOkResponse(model)
  );
}
