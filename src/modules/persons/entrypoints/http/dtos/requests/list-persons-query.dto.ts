// src/modules/persons/entrypoints/http/dtos/requests/list-persons-query.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ListPersonsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filtrar personas por tipo de documento.',
    example: 'a1b2c3d4-e5f6-4890-9234-56789abcdef0',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El tipo de documento debe ser un UUID válido' })
  documentTypeId?: string;

  @ApiPropertyOptional({
    description: 'Búsqueda por número de documento, nombres, apellidos o correo electrónico.',
    example: 'Juan Pérez',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;
}
