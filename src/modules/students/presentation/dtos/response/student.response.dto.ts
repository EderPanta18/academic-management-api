// modules/students/presentation/dtos/response/student.response.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { StudentStatus } from "@students/domain/constants";

export class StudentResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "87654321" })
  dni!: string;

  @ApiProperty({ example: "María Elena" })
  firstName!: string;

  @ApiProperty({ example: "García Torres" })
  lastName!: string;

  @ApiProperty({ example: "María Elena García Torres" })
  fullName!: string;

  @ApiProperty({ example: "maria.garcia@gmail.com" })
  email!: string;

  @ApiProperty({ example: "987654321", nullable: true })
  phone!: string | null;

  @ApiProperty({
    example: "2000-05-20",
    nullable: true,
    type: String,
    format: "date"
  })
  birthDate!: Date | null;

  @ApiProperty({ example: 1 })
  careerId!: number;

  @ApiProperty({ example: "2024000042" })
  code!: string;

  @ApiProperty({ example: "maria.garcia@universidad.edu.pe", nullable: true })
  institutionalEmail!: string | null;

  @ApiProperty({
    example: "2024-03-01",
    type: String,
    format: "date"
  })
  enrollmentDate!: Date;

  @ApiProperty({ enum: StudentStatus, example: StudentStatus.ACTIVE })
  status!: StudentStatus;
}
