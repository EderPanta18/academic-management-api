// src/modules/persons/entrypoints/http/decorators/person-swagger.decorators.ts

import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreatePersonRequestDto, PersonResponseDto, UpdatePersonRequestDto } from '../dtos';

export function ApiCreatePerson(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar una nueva persona' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreatePersonRequestDto }),
    ApiCreatedResponse({
      type: PersonResponseDto,
      description: 'Persona registrada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'El tipo de documento indicado no existe.',
    }),
    ApiConflictResponse({
      description: 'Ya existe una persona con el mismo documento o correo electrónico.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para registrar personas.',
    }),
  );
}

export function ApiUpdatePerson(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Actualizar los datos de una persona' }),
    ApiParam({
      name: 'id',
      format: 'uuid',
      description: 'ID de la persona que se actualizará.',
    }),
    ApiBody({ type: UpdatePersonRequestDto }),
    ApiOkResponse({
      type: PersonResponseDto,
      description: 'Persona actualizada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'La persona no existe.',
    }),
    ApiConflictResponse({
      description: 'El correo electrónico ya está registrado por otra persona.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para actualizar personas.',
    }),
  );
}
