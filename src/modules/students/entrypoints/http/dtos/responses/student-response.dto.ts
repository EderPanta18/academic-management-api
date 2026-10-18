import { ApiProperty } from '@nestjs/swagger';
import { StudentStatus } from '@students/domain/entities';

export class StudentResponseDto {
  @ApiProperty({
    description: 'ID del estudiante.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la persona asociada.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  personId!: string;

  @ApiProperty({
    description: 'ID del programa académico.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  academicProgramId!: string;

  @ApiProperty({ description: 'Código institucional.', example: '2024000042' })
  code!: string;

  @ApiProperty({
    nullable: true,
    description: 'Correo electrónico institucional.',
    example: 'maria.garcia@universidad.edu.pe',
  })
  institutionalEmail!: string | null;

  @ApiProperty({ nullable: true, description: 'Periodo de admisión.', example: '2024-I' })
  admissionPeriod!: string | null;

  @ApiProperty({
    enum: StudentStatus,
    description: 'Estado académico.',
    example: StudentStatus.ACTIVE,
  })
  status!: StudentStatus;
}
