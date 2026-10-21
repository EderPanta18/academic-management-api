import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentResponseDto } from './enrollment-response.dto';

export class EnrollmentReadModelResponseDto extends EnrollmentResponseDto {
  // ── Datos del estudiante ────────────────────────────────────────────────

  @ApiProperty({ description: 'Código del estudiante.', example: 'STU-001' })
  studentCode!: string;

  @ApiProperty({ description: 'Nombres del estudiante.', example: 'María Elena' })
  studentFirstName!: string;

  @ApiProperty({ description: 'Apellidos del estudiante.', example: 'García Torres' })
  studentLastName!: string;

  // ── Datos del curso ─────────────────────────────────────────────────────

  @ApiProperty({
    description: 'ID del curso.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  courseId!: string;

  @ApiProperty({ description: 'Código del curso.', example: 'CS-101' })
  courseCode!: string;

  @ApiProperty({
    description: 'Nombre del curso.',
    example: 'Fundamentos de Programación',
  })
  courseName!: string;

  // ── Datos de la oferta ──────────────────────────────────────────────────

  @ApiProperty({ description: 'Sección de la oferta.', example: 'A' })
  section!: string;

  // ── Datos del período ───────────────────────────────────────────────────

  @ApiProperty({
    description: 'ID del período académico.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  academicPeriodId!: string;

  @ApiProperty({ description: 'Código del período académico.', example: '2026-I' })
  academicPeriodCode!: string;

  @ApiProperty({
    description: 'Nombre del período académico.',
    example: 'Periodo académico 2026-I',
  })
  academicPeriodName!: string;

  // ── Datos del usuario ───────────────────────────────────────────────────

  @ApiProperty({
    nullable: true,
    description: 'Correo electrónico del usuario que registró la inscripción.',
    example: 'secretaria@universidad.edu.pe',
  })
  registeredByUserEmail!: string | null;
}
