// modules/enrollments/presentation/dtos/response/enrollment-response.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnrollmentStatus } from '@enrollments/domain/constants';

export class EnrollmentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5 })
  studentId: number;

  @ApiProperty({ example: 3 })
  courseOfferingId: number;

  @ApiProperty({ enum: EnrollmentStatus, example: EnrollmentStatus.ENROLLED })
  status: EnrollmentStatus;

  @ApiProperty({ example: '2026-02-28' })
  enrollmentDate: string;

  @ApiPropertyOptional({ example: 1, nullable: true })
  createdBy: number | null;
}
