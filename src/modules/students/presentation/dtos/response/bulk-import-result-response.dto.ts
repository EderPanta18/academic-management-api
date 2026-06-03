// modules/students/presentation/dtos/response/bulk-import-result-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class BulkRowErrorResponseDto {
  @ApiProperty({
    example: 3,
    description: 'Número de fila en el archivo (fila 1 = encabezado)',
  })
  row!: number;

  @ApiProperty({
    example: 'email',
    description: 'Campo que causó el error. Vacío si es error de negocio',
  })
  field!: string;

  @ApiProperty({ example: 'email debe ser un correo válido' })
  reason!: string;
}

export class BulkImportResultResponseDto {
  @ApiProperty({
    example: 50,
    description: 'Total de filas del archivo',
  })
  totalRows!: number;

  @ApiProperty({ example: 48 })
  totalSuccess!: number;

  @ApiProperty({ example: 2 })
  totalFailed!: number;

  @ApiProperty({ type: [BulkRowErrorResponseDto] })
  errors!: BulkRowErrorResponseDto[];
}
