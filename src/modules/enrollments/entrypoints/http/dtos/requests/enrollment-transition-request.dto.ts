import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrimOptional } from '@shared/decorators';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ENROLLMENT_FIELDS } from './enrollment-fields.constants';

export class EnrollmentTransitionRequestDto {
  @ApiPropertyOptional({
    nullable: true,
    description: 'Motivo del cambio de estado.',
    example: 'Solicitud del estudiante por motivos personales.',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @MaxLength(ENROLLMENT_FIELDS.statusReason.maxLength, {
    message: `El motivo no puede tener más de ${ENROLLMENT_FIELDS.statusReason.maxLength} caracteres`,
  })
  reason?: string;
}
