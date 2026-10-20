import { ApiProperty } from '@nestjs/swagger';
import { CourseOfferingResponseDto } from './course-offering-response.dto';

export class CourseOfferingReadModelResponseDto extends CourseOfferingResponseDto {
  @ApiProperty({
    description: 'Código del curso.',
    example: 'CS-101',
  })
  courseCode!: string;

  @ApiProperty({
    description: 'Nombre del curso.',
    example: 'Fundamentos de Programación',
  })
  courseName!: string;

  @ApiProperty({
    description: 'Código del período académico.',
    example: '2026-I',
  })
  academicPeriodCode!: string;

  @ApiProperty({
    description: 'Nombre del período académico.',
    example: 'Periodo académico 2026-I',
  })
  academicPeriodName!: string;

  @ApiProperty({
    nullable: true,
    description: 'Nombre completo del profesor asignado.',
    example: 'Juan Carlos Pérez López',
  })
  professorFullName!: string | null;
}
