import { EnrollmentStatus } from '@enrollments/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentStatusLogReadModelResponseDto {
  @ApiProperty({
    description: 'ID del registro de cambio de estado.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la inscripción.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  enrollmentId!: string;

  @ApiProperty({
    enum: EnrollmentStatus,
    nullable: true,
    description: 'Estado anterior. Null cuando el registro es el estado inicial de la inscripción.',
    example: null,
  })
  previousStatus!: EnrollmentStatus | null;

  @ApiProperty({
    enum: EnrollmentStatus,
    description: 'Estado nuevo.',
    example: EnrollmentStatus.ENROLLED,
  })
  newStatus!: EnrollmentStatus;

  @ApiProperty({
    nullable: true,
    description: 'Motivo del cambio de estado.',
    example: 'Solicitud del estudiante por motivos personales.',
  })
  reason!: string | null;

  @ApiProperty({
    description: 'ID del usuario que realizó el cambio.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  changedByUserId!: string;

  @ApiProperty({
    nullable: true,
    description: 'Correo electrónico del usuario que realizó el cambio.',
    example: 'secretaria@universidad.edu.pe',
  })
  changedByUserEmail!: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Fecha y hora del cambio.',
    example: '2026-02-15T10:30:00.000Z',
  })
  createdAt!: Date;
}
