import { AcademicPeriodStatus } from '@academic-periods/domain/entities';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListAcademicPeriodsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: AcademicPeriodStatus,
    description: 'Filtrar por estado del periodo.',
  })
  @IsOptional()
  @IsEnum(AcademicPeriodStatus, {
    message: `El estado debe ser uno de: ${Object.values(AcademicPeriodStatus).join(', ')}`,
  })
  status?: AcademicPeriodStatus;

  @ApiPropertyOptional({
    description: 'Búsqueda global (código, nombre).',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;
}
