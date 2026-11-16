// src/modules/persons/entrypoints/http/dtos/responses/person-read-model-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { PersonResponseDto } from './person-response.dto';

export class PersonReadModelResponseDto extends PersonResponseDto {
  @ApiProperty({
    description: 'Código del tipo de documento.',
    example: 'DNI',
  })
  documentTypeCode!: string;

  @ApiProperty({
    description: 'Nombre del tipo de documento.',
    example: 'Documento Nacional de Identidad',
  })
  documentTypeName!: string;
}
