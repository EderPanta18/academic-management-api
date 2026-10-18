import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@shared/dtos';
import { StudentImportStatus } from '@students/domain/entities';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class ListStudentImportsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado de procesamiento.',
    enum: StudentImportStatus,
  })
  @IsOptional()
  @IsEnum(StudentImportStatus, {
    message: `El estado debe ser uno de: ${Object.values(StudentImportStatus).join(', ')}`,
  })
  status?: StudentImportStatus;

  @ApiPropertyOptional({ description: 'Filtrar por ID del usuario creador.' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  createdByUserId?: string;
}
