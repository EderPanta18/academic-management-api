import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StudentImportStatus } from '@students/domain/entities';

class StudentImportErrorResponseDto {
  @ApiProperty({
    description: 'Número de fila en el archivo (la fila 1 es la cabecera).',
    example: 3,
  })
  row!: number;

  @ApiProperty({
    type: [String],
    description: 'Lista de motivos por los que falló la fila.',
    example: ['El DNI ya está registrado', 'El correo no tiene un formato válido'],
  })
  reasons!: string[];
}

export class StudentImportReadModelResponseDto {
  @ApiProperty({
    description: 'ID de la importación.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre original del archivo subido.',
    example: 'estudiantes_2024.xlsx',
  })
  fileName!: string;

  @ApiProperty({
    description: 'Extensión del archivo.',
    example: '.xlsx',
  })
  fileExtension!: string;

  @ApiProperty({
    nullable: true,
    description: 'Tamaño del archivo en bytes.',
    example: 102400,
  })
  fileSize!: number | null;

  @ApiProperty({
    nullable: true,
    description: 'Tipo MIME del archivo.',
    example: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  fileMimeType!: string | null;

  @ApiProperty({
    enum: StudentImportStatus,
    description: 'Estado actual del proceso de importación.',
    example: StudentImportStatus.COMPLETED_WITH_ERRORS,
  })
  status!: StudentImportStatus;

  // ── Contadores ────────────────────────────────────────────────────────────

  @ApiProperty({
    description: 'Cantidad total de filas de datos en el archivo.',
    example: 100,
  })
  totalRows!: number;

  @ApiProperty({
    description: 'Cantidad de filas que ya han sido procesadas.',
    example: 100,
  })
  processedRows!: number;

  @ApiProperty({
    description: 'Cantidad de estudiantes creados exitosamente.',
    example: 85,
  })
  acceptedRows!: number;

  @ApiProperty({
    description: 'Cantidad de filas rechazadas por errores de validación.',
    example: 10,
  })
  rejectedRows!: number;

  @ApiProperty({
    description: 'Cantidad de filas omitidas por ser duplicados.',
    example: 5,
  })
  duplicatedRows!: number;

  @ApiProperty({
    description: 'Cantidad de filas con observaciones (ej. programa académico no existe).',
    example: 0,
  })
  observedRows!: number;

  // ── Resultados ────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    type: [StudentImportErrorResponseDto],
    nullable: true,
    description: 'Listado detallado de los errores ocurridos por fila.',
    example: [
      {
        row: 2,
        reasons: ['El número de documento ya está registrado en el sistema.'],
      },
      {
        row: 5,
        reasons: ['El correo personal no tiene un formato válido.', 'El nombre es obligatorio.'],
      },
    ],
  })
  errors!: StudentImportErrorResponseDto[] | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Motivo por el cual falló catastróficamente todo el proceso (si aplica).',
    example: 'No se encontró el archivo binario en la base de datos.',
  })
  failureReason!: string | null;

  // ── Auditoría ─────────────────────────────────────────────────────────────

  @ApiProperty({
    description: 'ID del usuario que inició la importación.',
    example: 'f9e8d7c6-b5a4-3210-9876-fedcba987654',
  })
  createdByUserId!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: 'Fecha y hora en que inició el procesamiento.',
    example: '2026-10-18T10:28:00.000Z',
  })
  startedAt!: Date | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: 'Fecha y hora en que finalizó el procesamiento.',
    example: '2026-10-18T10:30:00.000Z',
  })
  finishedAt!: Date | null;
}
