import { AcademicPeriodStatus } from '@academic-periods/domain/entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@shared/decorators';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ACADEMIC_PERIOD_FIELDS } from './academic-period-fields.constants';

export class CreateAcademicPeriodRequestDto {
  @ApiProperty({
    description: 'Código único del periodo académico.',
    example: '2026-I',
  })
  @Trim()
  @IsDefined({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código no puede estar vacío' })
  @MaxLength(ACADEMIC_PERIOD_FIELDS.code.maxLength, {
    message: `El código no puede tener más de ${ACADEMIC_PERIOD_FIELDS.code.maxLength} caracteres`,
  })
  @Matches(ACADEMIC_PERIOD_FIELDS.code.pattern, {
    message: 'El código solo puede contener mayúsculas, números y guiones',
  })
  code!: string;

  @ApiProperty({
    description: 'Nombre del periodo académico.',
    example: 'Periodo académico 2026-I',
  })
  @Trim()
  @IsDefined({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(ACADEMIC_PERIOD_FIELDS.name.maxLength, {
    message: `El nombre no puede tener más de ${ACADEMIC_PERIOD_FIELDS.name.maxLength} caracteres`,
  })
  name!: string;

  @ApiProperty({
    type: String,
    format: 'date',
    description: 'Fecha de inicio del periodo académico.',
    example: '2026-03-01',
  })
  @IsDefined({ message: 'La fecha de inicio es obligatoria' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida' })
  startDate!: Date;

  @ApiProperty({
    type: String,
    format: 'date',
    description: 'Fecha de cierre del periodo académico.',
    example: '2026-07-15',
  })
  @IsDefined({ message: 'La fecha de cierre es obligatoria' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de cierre debe ser una fecha válida' })
  endDate!: Date;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    description: 'Fecha de inicio de la ventana de inscripciones.',
    example: '2026-01-15',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio de inscripciones debe ser una fecha válida' })
  enrollmentStartDate?: Date;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    description: 'Fecha de fin de la ventana de inscripciones.',
    example: '2026-02-28',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de fin de inscripciones debe ser una fecha válida' })
  enrollmentEndDate?: Date;

  @ApiPropertyOptional({
    enum: AcademicPeriodStatus,
    default: AcademicPeriodStatus.PLANNED,
    description: 'Estado inicial del periodo académico.',
    example: AcademicPeriodStatus.PLANNED,
  })
  @IsOptional()
  @IsEnum(AcademicPeriodStatus, {
    message: `El estado debe ser uno de: ${Object.values(AcademicPeriodStatus).join(', ')}`,
  })
  status?: AcademicPeriodStatus;
}
