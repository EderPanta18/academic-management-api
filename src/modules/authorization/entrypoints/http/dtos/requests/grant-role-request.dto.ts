// src/modules/authorization/entrypoints/http/dtos/requests/grant-role-request.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class GrantRoleRequestDto {
  @ApiProperty({
    format: 'uuid',
    description: 'ID del rol que se asignará a la cuenta.',
    example: 'a1b2c3d4-e5f6-4890-9234-56789abcdef0',
  })
  @IsDefined({ message: 'El ID del rol es obligatorio' })
  @IsUUID('4', { message: 'El ID del rol debe ser un UUID válido' })
  roleId!: string;
}
