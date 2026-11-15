// src/modules/authorization/entrypoints/http/dtos/requests/list-roles-query.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ListRolesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar roles institucionales o personalizados.',
    example: false,
  })
  @Transform(({ value }: { value: unknown }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsOptional()
  @IsBoolean({ message: 'El indicador de rol institucional debe ser un booleano válido' })
  isSystem?: boolean;

  @ApiPropertyOptional({
    description: 'Búsqueda por código o nombre del rol.',
    example: 'académico',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;
}
