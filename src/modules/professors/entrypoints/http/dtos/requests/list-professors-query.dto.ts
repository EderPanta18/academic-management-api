import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProfessorStatus } from '@professors/domain/entities';
import { TrimOptional } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListProfessorsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por departamento.' })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El departamento debe ser una cadena de texto' })
  department?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado.', enum: ProfessorStatus })
  @IsOptional()
  @IsEnum(ProfessorStatus, {
    message: `El estado debe ser uno de: ${Object.values(ProfessorStatus).join(', ')}`,
  })
  status?: ProfessorStatus;

  @ApiPropertyOptional({
    description: 'Búsqueda global (código, documento, nombre, email).',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;
}
