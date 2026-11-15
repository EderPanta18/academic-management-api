// src/modules/authorization/entrypoints/http/dtos/responses/role-user-read-model-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class RoleUserReadModelResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'ID de la cuenta que tiene asignado el rol.',
    example: 'a1b2c3d4-e5f6-4890-9234-56789abcdef0',
  })
  userId!: string;

  @ApiProperty({
    format: 'date-time',
    description: 'Fecha y hora de asignación del rol.',
    example: '2026-11-14T10:30:00.000Z',
  })
  assignedAt!: Date;
}
