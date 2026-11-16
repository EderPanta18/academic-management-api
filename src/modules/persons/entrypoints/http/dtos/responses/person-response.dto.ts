// src/modules/persons/entrypoints/http/dtos/responses/person-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class PersonResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'ID de la persona.',
    example: 'a1b2c3d4-e5f6-4890-9234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    description: 'ID del tipo de documento.',
    example: 'b1b2c3d4-e5f6-4890-9234-56789abcdef0',
  })
  documentTypeId!: string;

  @ApiProperty({
    description: 'Número de documento de identidad.',
    example: '12345678',
  })
  documentNumber!: string;

  @ApiProperty({
    description: 'Nombres de la persona.',
    example: 'Juan Carlos',
  })
  firstName!: string;

  @ApiProperty({
    description: 'Apellidos de la persona.',
    example: 'Pérez García',
  })
  lastName!: string;

  @ApiProperty({
    nullable: true,
    description: 'Correo electrónico personal.',
    example: 'juan.perez@example.com',
  })
  email!: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Número telefónico de la persona.',
    example: '987654321',
  })
  phone!: string | null;

  @ApiProperty({
    type: String,
    format: 'date',
    nullable: true,
    description: 'Fecha de nacimiento.',
    example: '2000-05-15',
  })
  birthDate!: string | null;
}
