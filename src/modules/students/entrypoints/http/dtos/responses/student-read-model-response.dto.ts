import { ApiProperty } from '@nestjs/swagger';
import { StudentResponseDto } from './student-response.dto';

export class StudentReadModelResponseDto extends StudentResponseDto {
  @ApiProperty({
    description: 'Nombre del tipo de documento de identidad.',
    example: 'DNI',
  })
  documentTypeName!: string;

  @ApiProperty({ description: 'Número de documento de identidad.', example: '87654321' })
  documentNumber!: string;

  @ApiProperty({ description: 'Nombres del estudiante.', example: 'María Elena' })
  firstName!: string;

  @ApiProperty({ description: 'Apellidos del estudiante.', example: 'García Torres' })
  lastName!: string;

  @ApiProperty({
    nullable: true,
    description: 'Correo electrónico personal.',
    example: 'maria@gmail.com',
  })
  email!: string | null;

  @ApiProperty({ nullable: true, description: 'Teléfono de contacto.', example: '987654321' })
  phone!: string | null;

  @ApiProperty({
    type: String,
    format: 'date',
    nullable: true,
    description: 'Fecha de nacimiento.',
    example: '2000-05-20',
  })
  birthDate!: Date | null;
}
