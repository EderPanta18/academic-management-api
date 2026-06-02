// modules/professors/presentation/decorators/api-professor.decorator.ts

import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiNotFoundResponse
} from "@nestjs/swagger";

import { ApiPaginatedOperation } from "@shared/decorators";
import { CreateProfessorDto, ProfessorResponseDto } from "../dtos";

export const ApiCreateProfessor = () =>
  applyDecorators(
    ApiOperation({ summary: "Registrar un nuevo profesor" }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateProfessorDto }),
    ApiCreatedResponse({
      type: ProfessorResponseDto,
      description: "Profesor creado correctamente"
    }),
    ApiNotFoundResponse({
      description: "El departamento especificado no existe"
    }),
    ApiConflictResponse({ description: "El DNI o email ya están registrados" })
  );

export const ApiListProfessors = () =>
  applyDecorators(
    ApiOperation({ summary: "Listar profesores activos con paginación" }),
    ApiQuery({
      name: "departmentId",
      required: false,
      type: Number,
      example: 1,
      description: "Filtrar por id de departamento"
    }),
    ApiPaginatedOperation(ProfessorResponseDto)
  );

export const ApiGetProfessorById = () =>
  applyDecorators(
    ApiOperation({ summary: "Obtener un profesor por id" }),
    ApiParam({
      name: "id",
      type: Number,
      description: "Id del profesor",
      example: 1
    }),
    ApiOkResponse({
      type: ProfessorResponseDto,
      description: "Profesor encontrado"
    }),
    ApiNotFoundResponse({ description: "Profesor no encontrado" })
  );
