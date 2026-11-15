// src/modules/authorization/entrypoints/http/dtos/responses/role-detail-read-model-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { RoleReadModelResponseDto } from './role-read-model-response.dto';

export class RoleDetailReadModelResponseDto extends RoleReadModelResponseDto {
  @ApiProperty({
    type: [String],
    description: 'IDs de los permisos asociados.',
    example: ['a1b2c3d4-e5f6-4890-9234-56789abcdef0', 'b1b2c3d4-e5f6-4890-9234-56789abcdef0'],
  })
  permissionIds!: string[];
}
