// src/modules/authorization/entrypoints/http/dtos/responses/permission-read-model-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class PermissionReadModelResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'ID del permiso.',
    example: 'a1b2c3d4-e5f6-4890-9234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'Código del permiso.',
    example: 'roles.create',
  })
  code!: string;

  @ApiProperty({
    description: 'Nombre del permiso.',
    example: 'Crear roles',
  })
  name!: string;

  @ApiProperty({
    nullable: true,
    description: 'Descripción del permiso.',
    example: 'Permite registrar nuevos roles personalizados.',
  })
  description!: string | null;

  @ApiProperty({
    description: 'Módulo funcional al que pertenece el permiso.',
    example: 'authorization',
  })
  module!: string;

  @ApiProperty({
    description: 'Indica si el permiso está reservado para uso institucional.',
    example: false,
  })
  isReserved!: boolean;
}
