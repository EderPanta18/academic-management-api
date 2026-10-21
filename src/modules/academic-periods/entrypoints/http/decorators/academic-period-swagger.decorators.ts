import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { AcademicPeriodResponseDto, CreateAcademicPeriodRequestDto } from '../dtos';

export function ApiCreateAcademicPeriod() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo periodo académico' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateAcademicPeriodRequestDto }),
    ApiCreatedResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico creado correctamente.',
    }),
    ApiConflictResponse({
      description: 'Ya existe un periodo académico con ese código.',
    }),
  );
}
