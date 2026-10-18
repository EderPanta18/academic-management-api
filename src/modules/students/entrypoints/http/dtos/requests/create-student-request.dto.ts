import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim, TrimOptional } from '@shared/decorators';
import { StudentStatus } from '@students/domain/entities';
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
import { STUDENT_FIELDS } from './student-fields.constants';

export class CreateStudentRequestDto {
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
  @MaxLength(STUDENT_FIELDS.documentNumber.maxLength, {
    message: `El número de documento no puede tener más de ${STUDENT_FIELDS.documentNumber.maxLength} caracteres`,
  })
  @Matches(STUDENT_FIELDS.documentNumber.pattern, {
    message: 'El número de documento solo puede contener mayúsculas, números y guiones',
  })
  documentNumber!: string;

  @ApiProperty({ description: 'Nombres del estudiante.', example: 'María Elena' })
  @Trim()
  @IsDefined({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(STUDENT_FIELDS.firstName.maxLength, {
    message: `El nombre no puede tener más de ${STUDENT_FIELDS.firstName.maxLength} caracteres`,
  })
  firstName!: string;

  @ApiProperty({ description: 'Apellidos del estudiante.', example: 'García Torres' })
  @Trim()
  @IsDefined({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  @MaxLength(STUDENT_FIELDS.lastName.maxLength, {
    message: `El apellido no puede tener más de ${STUDENT_FIELDS.lastName.maxLength} caracteres`,
  })
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico personal.',
    example: 'maria.garcia@gmail.com',
  })
  @TrimOptional()
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @MaxLength(STUDENT_FIELDS.email.maxLength, {
    message: `El email no puede tener más de ${STUDENT_FIELDS.email.maxLength} caracteres`,
  })
  email?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto.', example: '987654321' })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MaxLength(STUDENT_FIELDS.phone.maxLength, {
    message: `El teléfono no puede tener más de ${STUDENT_FIELDS.phone.maxLength} caracteres`,
  })
  @Matches(STUDENT_FIELDS.phone.pattern, {
    message: 'El teléfono debe contener exactamente 9 dígitos numéricos',
  })
  phone?: string;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento.', example: '2000-05-20' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate?: Date;

  // ── Campos propios de Student ─────────────────────────────────────────────

  @ApiProperty({
    description: 'ID del programa académico.',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsDefined({ message: 'El ID del programa académico es obligatorio' })
  @IsUUID('4', { message: 'El ID del programa académico debe ser un UUID válido' })
  academicProgramId!: string;

  @ApiProperty({ description: 'Código institucional.', example: '2024000042' })
  @Trim()
  @IsDefined({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código no puede estar vacío' })
  @MaxLength(STUDENT_FIELDS.code.maxLength, {
    message: `El código no puede tener más de ${STUDENT_FIELDS.code.maxLength} caracteres`,
  })
  @Matches(STUDENT_FIELDS.code.pattern, {
    message: 'El código solo puede contener letras mayúsculas, números y guiones',
  })
  code!: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico institucional.',
    example: 'maria.garcia@universidad.edu.pe',
  })
  @TrimOptional()
  @IsOptional()
  @IsEmail({}, { message: 'El email institucional debe tener un formato válido' })
  @MaxLength(STUDENT_FIELDS.institutionalEmail.maxLength, {
    message: `El email institucional no puede tener más de ${STUDENT_FIELDS.institutionalEmail.maxLength} caracteres`,
  })
  institutionalEmail?: string;

  @ApiPropertyOptional({ description: 'Periodo de admisión.', example: '2024-I' })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: 'El periodo de admisión debe ser una cadena de texto' })
  @MaxLength(STUDENT_FIELDS.admissionPeriod.maxLength, {
    message: `El periodo de admisión no puede tener más de ${STUDENT_FIELDS.admissionPeriod.maxLength} caracteres`,
  })
  admissionPeriod?: string;

  @ApiPropertyOptional({
    description: 'Estado académico.',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StudentStatus, {
    message: `El estado debe ser uno de: ${Object.values(StudentStatus).join(', ')}`,
  })
  status?: StudentStatus;
}
