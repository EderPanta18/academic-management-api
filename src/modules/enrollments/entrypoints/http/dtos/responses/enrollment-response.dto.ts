import { EnrollmentStatus } from '@enrollments/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentResponseDto {
  @ApiProperty({
    description: 'ID de la inscripción.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del estudiante.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  studentId!: string;

  @ApiProperty({
    description: 'ID de la oferta de curso.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  courseOfferingId!: string;

  @ApiProperty({
    description: 'ID del usuario que registró la inscripción.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  registeredByUserId!: string;

  @ApiProperty({
    enum: EnrollmentStatus,
    description: 'Estado actual de la inscripción.',
    example: EnrollmentStatus.ENROLLED,
  })
  status!: EnrollmentStatus;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Fecha en que se registró la inscripción.',
    example: '2026-02-15T10:30:00.000Z',
  })
  enrolledAt!: Date;

  @ApiProperty({
    nullable: true,
    description: 'Motivo del estado actual, cuando aplique.',
    example: 'Solicitud del estudiante por motivos personales.',
  })
  statusReason!: string | null;
}
