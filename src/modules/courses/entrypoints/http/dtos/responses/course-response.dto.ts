import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty({
    description: 'ID del curso.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del programa académico.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  academicProgramId!: string;

  @ApiProperty({
    nullable: true,
    description: 'ID de la categoría del curso.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  courseCategoryId!: string | null;

  @ApiProperty({ description: 'Código del curso.', example: 'CS-101' })
  code!: string;

  @ApiProperty({
    description: 'Nombre del curso.',
    example: 'Fundamentos de Programación',
  })
  name!: string;

  @ApiProperty({
    nullable: true,
    description: 'Descripción del curso.',
    example: 'Fundamentos de modelado relacional y SQL',
  })
  description!: string | null;

  @ApiProperty({ description: 'Créditos académicos.', example: 4 })
  credits!: number;

  @ApiProperty({ nullable: true, description: 'Horas académicas.', example: 64 })
  hours!: number | null;
}
