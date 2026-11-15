// src/modules/authorization/entrypoints/http/dtos/responses/role-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'ID del rol.',
    example: 'a1b2c3d4-e5f6-4890-9234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'Código del rol.',
    example: 'ACADEMIC_ASSISTANT',
  })
  code!: string;

  @ApiProperty({
    description: 'Nombre del rol.',
    example: 'Asistente académico',
  })
  name!: string;

  @ApiProperty({
    nullable: true,
    description: 'Descripción del rol.',
    example: 'Rol para apoyar las operaciones académicas.',
  })
  description!: string | null;

  @ApiProperty({
    description: 'Indica si el rol es institucional.',
    example: false,
  })
  isSystem!: boolean;
}
