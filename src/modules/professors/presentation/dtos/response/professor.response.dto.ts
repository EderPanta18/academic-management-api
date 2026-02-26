// modules/professors/presentation/dtos/response/professor.response.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { ProfessorStatus } from '@professors/domain/constants';

export class ProfessorResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '12345678' })
  dni: string;

  @ApiProperty({ example: 'Juan Carlos' })
  firstName: string;

  @ApiProperty({ example: 'Pérez López' })
  lastName: string;

  @ApiProperty({ example: 'Juan Carlos Pérez López' })
  fullName: string;

  @ApiProperty({ example: 'juan.perez@gmail.com' })
  email: string;

  @ApiProperty({ example: '987654321', nullable: true })
  phone: string | null;

  @ApiProperty({
    example: '1985-06-15',
    nullable: true,
    type: String,
    format: 'date',
  })
  birthDate: Date | null;

  @ApiProperty({ example: 1, nullable: true })
  departmentId: number | null;

  @ApiProperty({ example: 'PROF-001' })
  code: string;

  @ApiProperty({ example: 'juan.perez@universidad.edu.pe', nullable: true })
  institutionalEmail: string | null;

  @ApiProperty({ example: 'Bases de Datos', nullable: true })
  specialty: string | null;

  @ApiProperty({
    example: '2024-03-01',
    nullable: true,
    type: String,
    format: 'date',
  })
  hireDate: Date | null;

  @ApiProperty({ enum: ProfessorStatus, example: ProfessorStatus.ACTIVE })
  status: ProfessorStatus;
}
