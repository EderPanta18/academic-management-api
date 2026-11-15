// src/modules/authorization/entrypoints/http/dtos/requests/update-role-request.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Trim, TrimOptional } from '@shared/decorators';
import { IsArray, IsNotEmpty, IsString, IsUUID, MaxLength, ValidateIf } from 'class-validator';
import { ROLE_FIELDS } from './role-fields.constants';

export class UpdateRoleRequestDto {
  @ApiPropertyOptional({
    maxLength: ROLE_FIELDS.name.maxLength,
    description: 'Nuevo nombre del rol.',
    example: 'Asistente académico avanzado',
  })
  @Trim()
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(ROLE_FIELDS.name.maxLength, {
    message: `El nombre no puede tener más de ${ROLE_FIELDS.name.maxLength} caracteres`,
  })
  name?: string;

  @ApiPropertyOptional({
    nullable: true,
    maxLength: ROLE_FIELDS.description.maxLength,
    description: 'Nueva descripción del rol.',
    example: 'Rol para apoyar la coordinación académica.',
  })
  @TrimOptional()
  @ValidateIf((_, value: unknown) => value !== undefined && value !== null)
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(ROLE_FIELDS.description.maxLength, {
    message: `La descripción no puede tener más de ${ROLE_FIELDS.description.maxLength} caracteres`,
  })
  description?: string | null;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Nuevos IDs de los permisos.',
    example: ['a1b2c3d4-e5f6-4890-9234-56789abcdef0'],
  })
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsArray({ message: 'Los permisos deben enviarse en un arreglo' })
  @IsUUID('4', {
    each: true,
    message: 'Cada permiso debe tener un UUID válido',
  })
  permissionIds?: string[];
}
