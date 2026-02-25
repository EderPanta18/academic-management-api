// modules/professors/presentation/dtos/response/professor.response.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfessorStatus } from '@professors/domain/constants';

export class ProfessorResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juan Carlos Pérez López' })
  fullName: string;

  @ApiProperty({ example: 'Juan Carlos' })
  firstName: string;

  @ApiProperty({ example: 'Pérez López' })
  lastName: string;

  @ApiProperty({ example: '12345678' })
  dni: string;

  @ApiProperty({ example: 'juan.perez@universidad.edu.pe' })
  email: string;

  @ApiPropertyOptional({ example: '987654321', nullable: true })
  phone: string | null;

  @ApiPropertyOptional({
    example: '1985-06-15',
    nullable: true,
    type: String,
    format: 'date',
  })
  birthDate: Date | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  departmentId: number | null;

  @ApiPropertyOptional({ example: 'Bases de Datos', nullable: true })
  specialty: string | null;

  @ApiPropertyOptional({
    example: '2024-03-01',
    nullable: true,
    type: String,
    format: 'date',
  })
  hireDate: Date | null;

  @ApiProperty({ enum: ProfessorStatus, example: ProfessorStatus.ACTIVE })
  status: ProfessorStatus;
}
