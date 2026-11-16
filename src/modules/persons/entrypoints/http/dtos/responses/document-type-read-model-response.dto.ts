// src/modules/persons/entrypoints/http/dtos/responses/document-type-read-model-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class DocumentTypeReadModelResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'ID del tipo de documento.',
    example: 'a1b2c3d4-e5f6-4890-9234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'Código del tipo de documento.',
    example: 'DNI',
  })
  code!: string;

  @ApiProperty({
    description: 'Nombre del tipo de documento.',
    example: 'Documento Nacional de Identidad',
  })
  name!: string;

  @ApiProperty({
    nullable: true,
    description: 'Descripción del tipo de documento.',
    example: 'Documento oficial de identificación nacional.',
  })
  description!: string | null;
}
