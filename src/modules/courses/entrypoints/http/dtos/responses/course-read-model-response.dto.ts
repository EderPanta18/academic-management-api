import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from './course-response.dto';

export class CourseReadModelResponseDto extends CourseResponseDto {
  @ApiProperty({
    description: 'Nombre del programa académico.',
    example: 'Ingeniería de Software',
  })
  academicProgramName!: string;

  @ApiProperty({
    nullable: true,
    description: 'Nombre de la categoría del curso.',
    example: 'Especialidad',
  })
  courseCategoryName!: string | null;
}
