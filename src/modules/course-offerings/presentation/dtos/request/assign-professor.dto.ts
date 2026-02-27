// modules/course-offerings/presentation/dtos/request/assign-professor.dto.ts

import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignProfessorDto {
  @ApiProperty({
    description: 'ID del profesor a asignar',
    example: 5,
    format: 'int32',
  })
  @IsInt({ message: 'El ID del profesor debe ser un número entero' })
  @IsPositive({ message: 'El ID del profesor debe ser positivo' })
  professorId: number;
}
