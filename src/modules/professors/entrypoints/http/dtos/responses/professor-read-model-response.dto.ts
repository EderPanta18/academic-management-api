import { ApiProperty } from '@nestjs/swagger';
import { ProfessorResponseDto } from './professor-response.dto';

export class ProfessorReadModelResponseDto extends ProfessorResponseDto {
  @ApiProperty({
    description: 'Nombre del tipo de documento de identidad.',
    example: 'DNI',
  })
  documentTypeName!: string;

  @ApiProperty({
    description: 'Número de documento de identidad.',
    example: '87654321',
  })
  documentNumber!: string;

  @ApiProperty({ description: 'Nombres del profesor.', example: 'Juan Carlos' })
  firstName!: string;

  @ApiProperty({ description: 'Apellidos del profesor.', example: 'Pérez López' })
  lastName!: string;

  @ApiProperty({
    nullable: true,
    description: 'Correo electrónico personal.',
    example: 'juan.perez@gmail.com',
  })
  email!: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Teléfono de contacto.',
    example: '987654321',
  })
  phone!: string | null;

  @ApiProperty({
    type: String,
    format: 'date',
    nullable: true,
    description: 'Fecha de nacimiento.',
    example: '1985-06-15',
  })
  birthDate!: Date | null;
}
