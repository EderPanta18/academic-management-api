import { ApiProperty } from '@nestjs/swagger';
import { ProfessorStatus } from '@professors/domain/entities';

export class ProfessorResponseDto {
  @ApiProperty({
    description: 'ID del profesor.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la persona asociada.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  personId!: string;

  @ApiProperty({ description: 'Código institucional.', example: 'PROF-001' })
  code!: string;

  @ApiProperty({
    nullable: true,
    description: 'Correo electrónico institucional.',
    example: 'juan.perez@universidad.edu.pe',
  })
  institutionalEmail!: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Departamento o área académica.',
    example: 'Ciencias de la Computación',
  })
  department!: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Especialidad.',
    example: 'Bases de Datos',
  })
  specialty!: string | null;

  @ApiProperty({
    enum: ProfessorStatus,
    description: 'Estado del profesor.',
    example: ProfessorStatus.ACTIVE,
  })
  status!: ProfessorStatus;
}
