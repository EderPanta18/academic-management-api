import { AcademicPeriodStatus } from '@academic-periods/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class AcademicPeriodResponseDto {
  @ApiProperty({
    description: 'ID del periodo académico.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({ description: 'Código único del periodo.', example: '2026-I' })
  code!: string;

  @ApiProperty({
    description: 'Nombre del periodo académico.',
    example: 'Periodo académico 2026-I',
  })
  name!: string;

  @ApiProperty({
    type: String,
    format: 'date',
    description: 'Fecha de inicio del periodo.',
    example: '2026-03-01',
  })
  startDate!: Date;

  @ApiProperty({
    type: String,
    format: 'date',
    description: 'Fecha de cierre del periodo.',
    example: '2026-07-15',
  })
  endDate!: Date;

  @ApiProperty({
    type: String,
    format: 'date',
    nullable: true,
    description: 'Fecha de inicio de inscripciones.',
    example: '2026-01-15',
  })
  enrollmentStartDate!: Date | null;

  @ApiProperty({
    type: String,
    format: 'date',
    nullable: true,
    description: 'Fecha de fin de inscripciones.',
    example: '2026-02-28',
  })
  enrollmentEndDate!: Date | null;

  @ApiProperty({
    enum: AcademicPeriodStatus,
    description: 'Estado del periodo académico.',
    example: AcademicPeriodStatus.OPEN,
  })
  status!: AcademicPeriodStatus;
}
