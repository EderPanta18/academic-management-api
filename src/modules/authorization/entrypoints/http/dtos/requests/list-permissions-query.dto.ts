// src/modules/authorization/entrypoints/http/dtos/requests/list-permissions-query.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

const PERMISSION_MODULE_MAX_LENGTH = 100;

export class ListPermissionsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    maxLength: PERMISSION_MODULE_MAX_LENGTH,
    description: 'Filtrar permisos por módulo funcional.',
    example: 'authorization',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El módulo debe ser una cadena de texto' })
  @MaxLength(PERMISSION_MODULE_MAX_LENGTH, {
    message: `El módulo no puede tener más de ${PERMISSION_MODULE_MAX_LENGTH} caracteres`,
  })
  module?: string;

  @ApiPropertyOptional({
    description: 'Filtrar permisos reservados u ordinarios.',
    example: false,
  })
  @Transform(({ value }: { value: unknown }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsOptional()
  @IsBoolean({ message: 'El indicador de permiso reservado debe ser un booleano válido' })
  isReserved?: boolean;

  @ApiPropertyOptional({
    description: 'Búsqueda por código o nombre del permiso.',
    example: 'roles',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;
}
