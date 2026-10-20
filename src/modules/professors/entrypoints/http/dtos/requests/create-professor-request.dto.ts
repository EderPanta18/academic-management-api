import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfessorStatus } from '@professors/domain/entities';
import { Trim, TrimOptional } from '@shared/decorators';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { PROFESSOR_FIELDS } from './professor-fields.constants';

export class CreateProfessorRequestDto {
  // ── Campos de Persona ─────────────────────────────────────────────────────

  @ApiProperty({
    description: 'ID del tipo de documento de identidad.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsDefined({ message: 'El ID del tipo de documento es obligatorio' })
  @IsUUID('4', { message: 'El ID del tipo de documento debe ser un UUID válido' })
  documentTypeId!: string;

  @ApiProperty({ description: 'Número de documento de identidad.', example: '87654321' })
  @Trim()
  @IsDefined({ message: 'El número de documento es obligatorio' })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número de documento no puede estar vacío' })
  @MaxLength(PROFESSOR_FIELDS.documentNumber.maxLength, {
    message: `El número de documento no puede tener más de ${PROFESSOR_FIELDS.documentNumber.maxLength} caracteres`,
  })
  @Matches(PROFESSOR_FIELDS.documentNumber.pattern, {
    message: 'El número de documento solo puede contener mayúsculas, números y guiones',
  })
  documentNumber!: string;

  @ApiProperty({ description: 'Nombres del profesor.', example: 'Juan Carlos' })
  @Trim()
  @IsDefined({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(PROFESSOR_FIELDS.firstName.maxLength, {
    message: `El nombre no puede tener más de ${PROFESSOR_FIELDS.firstName.maxLength} caracteres`,
  })
  firstName!: string;

  @ApiProperty({ description: 'Apellidos del profesor.', example: 'Pérez López' })
  @Trim()
  @IsDefined({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  @MaxLength(PROFESSOR_FIELDS.lastName.maxLength, {
    message: `El apellido no puede tener más de ${PROFESSOR_FIELDS.lastName.maxLength} caracteres`,
  })
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico personal.',
    example: 'juan.perez@gmail.com',
  })
  @TrimOptional()
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @MaxLength(PROFESSOR_FIELDS.email.maxLength, {
    message: `El email no puede tener más de ${PROFESSOR_FIELDS.email.maxLength} caracteres`,
  })
  email?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto.', example: '987654321' })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MaxLength(PROFESSOR_FIELDS.phone.maxLength, {
    message: `El teléfono no puede tener más de ${PROFESSOR_FIELDS.phone.maxLength} caracteres`,
  })
  @Matches(PROFESSOR_FIELDS.phone.pattern, {
    message: 'El teléfono debe contener exactamente 9 dígitos numéricos',
  })
  phone?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    description: 'Fecha de nacimiento.',
    example: '1985-06-15',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate?: Date;

  // ── Campos propios de Professor ───────────────────────────────────────────

  @ApiProperty({ description: 'Código institucional.', example: 'PROF-001' })
  @Trim()
  @IsDefined({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código no puede estar vacío' })
  @MaxLength(PROFESSOR_FIELDS.code.maxLength, {
    message: `El código no puede tener más de ${PROFESSOR_FIELDS.code.maxLength} caracteres`,
  })
  @Matches(PROFESSOR_FIELDS.code.pattern, {
    message: 'El código solo puede contener letras mayúsculas, números y guiones',
  })
  code!: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico institucional.',
    example: 'juan.perez@universidad.edu.pe',
  })
  @TrimOptional()
  @IsOptional()
  @IsEmail({}, { message: 'El email institucional debe tener un formato válido' })
  @MaxLength(PROFESSOR_FIELDS.institutionalEmail.maxLength, {
    message: `El email institucional no puede tener más de ${PROFESSOR_FIELDS.institutionalEmail.maxLength} caracteres`,
  })
  institutionalEmail?: string;

  @ApiPropertyOptional({
    description: 'Departamento o área académica.',
    example: 'Ciencias de la Computación',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El departamento debe ser una cadena de texto' })
  @MaxLength(PROFESSOR_FIELDS.department.maxLength, {
    message: `El departamento no puede tener más de ${PROFESSOR_FIELDS.department.maxLength} caracteres`,
  })
  department?: string;

  @ApiPropertyOptional({
    description: 'Especialidad del profesor.',
    example: 'Bases de Datos',
  })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'La especialidad debe ser una cadena de texto' })
  @MaxLength(PROFESSOR_FIELDS.specialty.maxLength, {
    message: `La especialidad no puede tener más de ${PROFESSOR_FIELDS.specialty.maxLength} caracteres`,
  })
  specialty?: string;

  @ApiPropertyOptional({
    enum: ProfessorStatus,
    default: ProfessorStatus.ACTIVE,
    description: 'Estado del profesor.',
    example: ProfessorStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProfessorStatus, {
    message: `El estado debe ser uno de: ${Object.values(ProfessorStatus).join(', ')}`,
  })
  status?: ProfessorStatus;
}
