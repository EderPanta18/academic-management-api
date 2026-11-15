// src/modules/authorization/entrypoints/http/dtos/requests/create-role-request.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim, TrimOptional } from '@shared/decorators';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ROLE_FIELDS } from './role-fields.constants';

export class CreateRoleRequestDto {
  @ApiProperty({
    maxLength: ROLE_FIELDS.code.maxLength,
    description: 'Código del rol personalizado.',
    example: 'ACADEMIC_ASSISTANT',
  })
  @Trim()
  @IsDefined({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código no puede estar vacío' })
  @MaxLength(ROLE_FIELDS.code.maxLength, {
    message: `El código no puede tener más de ${ROLE_FIELDS.code.maxLength} caracteres`,
  })
  code!: string;

  @ApiProperty({
    maxLength: ROLE_FIELDS.name.maxLength,
    description: 'Nombre del rol personalizado.',
    example: 'Asistente académico',
  })
  @Trim()
  @IsDefined({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(ROLE_FIELDS.name.maxLength, {
    message: `El nombre no puede tener más de ${ROLE_FIELDS.name.maxLength} caracteres`,
  })
  name!: string;

  @ApiPropertyOptional({
    nullable: true,
    maxLength: ROLE_FIELDS.description.maxLength,
    description: 'Descripción del rol.',
    example: 'Rol para apoyar las operaciones académicas.',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(ROLE_FIELDS.description.maxLength, {
    message: `La descripción no puede tener más de ${ROLE_FIELDS.description.maxLength} caracteres`,
  })
  description?: string | null;

  @ApiProperty({
    type: [String],
    format: 'uuid',
    description: 'IDs de los permisos.',
    example: ['a1b2c3d4-e5f6-4890-9234-56789abcdef0'],
  })
  @IsDefined({ message: 'La lista de permisos es obligatoria' })
  @IsArray({ message: 'Los permisos deben enviarse en un arreglo' })
  @IsUUID('4', {
    each: true,
    message: 'Cada permiso debe tener un UUID válido',
  })
  permissionIds!: string[];
}
