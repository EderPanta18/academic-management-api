// modules/courses/presentation/dtos/response/course.response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  careerId: number;

  @ApiProperty({ example: 2, nullable: true })
  categoryId: number | null;

  @ApiProperty({ example: 'Bases de Datos I' })
  name: string;

  @ApiProperty({
    example: 'Fundamentos de modelado relacional y SQL',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 4 })
  credits: number;
}
