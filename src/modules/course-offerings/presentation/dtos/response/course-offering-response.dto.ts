// modules/course-offerings/presentation/dtos/response/course-offering-response.dto.ts

import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import { ApiProperty } from '@nestjs/swagger';

export class CourseOfferingResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 10 })
  courseId!: number;

  @ApiProperty({ example: 2026 })
  academicPeriodId!: number;

  @ApiProperty({ example: 5, nullable: true })
  professorId!: number | null;

  @ApiProperty({ example: 'A' })
  section!: string;

  @ApiProperty({ example: 30 })
  maxStudents!: number;

  @ApiProperty({
    example: '2026-04-15',
    nullable: true,
    type: String,
    format: 'date',
  })
  enrollmentDeadline!: Date | null;

  @ApiProperty({
    enum: CourseOfferingStatus,
    example: CourseOfferingStatus.INACTIVE,
  })
  status!: CourseOfferingStatus;

  @ApiProperty({ example: true })
  canAssignProfessor!: boolean;

  @ApiProperty({ example: false })
  isOpenForEnrollment!: boolean;

  @ApiProperty({ example: false })
  hasProfessor!: boolean;
}
