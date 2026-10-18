import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import { StudentStatus } from '@students/domain/entities';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class ListStudentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID del programa académico.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del programa académico debe ser un UUID válido' })
  academicProgramId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado acádemico.', enum: StudentStatus })
  @IsOptional()
  @IsEnum(StudentStatus, {
    message: `El estado debe ser uno de: ${Object.values(StudentStatus).join(', ')}`,
  })
  status?: StudentStatus;

  @ApiPropertyOptional({ description: 'Búsqueda global (código, documento, nombre, email).' })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;
}
