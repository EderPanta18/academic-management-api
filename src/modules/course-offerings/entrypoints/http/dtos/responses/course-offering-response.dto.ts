import { CourseOfferingStatus } from '@course-offerings/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CourseOfferingResponseDto {
  @ApiProperty({
    description: 'ID de la oferta de curso.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del curso.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  courseId!: string;

  @ApiProperty({
    description: 'ID del período académico.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  academicPeriodId!: string;

  @ApiProperty({
    nullable: true,
    description: 'ID del profesor asignado.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  professorId!: string | null;

  @ApiProperty({ description: 'Sección de la oferta.', example: 'A' })
  section!: string;

  @ApiProperty({ description: 'Cupo máximo.', example: 40 })
  maxCapacity!: number;

  @ApiProperty({
    nullable: true,
    description: 'Cupo disponible.',
    example: 35,
  })
  availableCapacity!: number | null;

  @ApiProperty({
    enum: CourseOfferingStatus,
    description: 'Estado de la oferta.',
    example: CourseOfferingStatus.DRAFT,
  })
  status!: CourseOfferingStatus;
}
