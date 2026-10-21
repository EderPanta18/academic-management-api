import { EnrollmentStatus } from '@enrollments/domain/entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ENROLLMENT_FIELDS } from './enrollment-fields.constants';

export class EnrollStudentRequestDto {
  @ApiProperty({
    description: 'ID del estudiante a inscribir.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsDefined({ message: 'El ID del estudiante es obligatorio' })
  @IsUUID('4', { message: 'El ID del estudiante debe ser un UUID válido' })
  studentId!: string;

  @ApiProperty({
    description: 'ID de la oferta de curso en la que se inscribe.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsDefined({ message: 'El ID de la oferta de curso es obligatorio' })
  @IsUUID('4', { message: 'El ID de la oferta debe ser un UUID válido' })
  courseOfferingId!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Fecha en que se registra la inscripción.',
    example: '2026-02-15T10:30:00.000Z',
  })
  @IsDefined({ message: 'La fecha de inscripción es obligatoria' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de inscripción debe ser una fecha válida' })
  enrolledAt!: Date;

  @ApiPropertyOptional({
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ENROLLED,
    description:
      'Estado inicial de la inscripción. Por defecto "ENROLLED" (inscripción directa). Usar "PENDING" si la institución requiere flujo de aprobación.',
    example: EnrollmentStatus.ENROLLED,
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus, {
    message: `El estado debe ser uno de: ${Object.values(EnrollmentStatus).join(', ')}`,
  })
  status?: EnrollmentStatus;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Motivo del estado inicial, cuando aplique.',
    example: 'Inscripción fuera de plazo autorizada por coordinación.',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @MaxLength(ENROLLMENT_FIELDS.statusReason.maxLength, {
    message: `El motivo no puede tener más de ${ENROLLMENT_FIELDS.statusReason.maxLength} caracteres`,
  })
  statusReason?: string;
}
