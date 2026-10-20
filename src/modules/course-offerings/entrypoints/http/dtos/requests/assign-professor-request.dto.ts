import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class AssignProfessorRequestDto {
  @ApiProperty({
    description: 'ID del profesor a asignar.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsDefined({ message: 'El ID del profesor es obligatorio' })
  @IsUUID('4', { message: 'El ID del profesor debe ser un UUID válido' })
  professorId!: string;
}
