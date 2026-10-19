import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ListCoursesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID del programa académico.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del programa académico debe ser un UUID válido' })
  academicProgramId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de la categoría de curso.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  courseCategoryId?: string;

  @ApiPropertyOptional({ description: 'Búsqueda global (código, nombre).' })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;
}
