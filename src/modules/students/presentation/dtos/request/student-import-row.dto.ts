// modules/students/presentation/dtos/request/student-import-row.dto.ts

import { Type } from "class-transformer";
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  MaxLength
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Trim, TrimOptional } from "@shared/decorators";

export class StudentImportRowDto {
  @ApiProperty({ example: "Juan Carlos" })
  @Trim()
  @IsDefined({ message: "El nombre es obligatorio" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre no puede estar vacío" })
  @MaxLength(100)
  nombres!: string;

  @ApiProperty({ example: "Pérez García" })
  @Trim()
  @IsDefined({ message: "El apellido es obligatorio" })
  @IsString({ message: "El apellido debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El apellido no puede estar vacío" })
  @MaxLength(100)
  apellidos!: string;

  @ApiProperty({ example: "87654321" })
  @Trim()
  @IsDefined({ message: "El DNI es obligatorio" })
  @IsString({ message: "El DNI debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El DNI  no puede estar vacío" })
  @Length(8, 8, { message: "El DNI debe tener exactamente 8 dígitos" })
  @Matches(/^\d{8}$/, { message: "El DNI debe contener solo dígitos" })
  dni!: string;

  @ApiProperty({ example: "juan@gmail.com" })
  @Trim()
  @IsDefined({ message: "El email es obligatorio" })
  @IsString({ message: "El email debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El email no puede estar vacío" })
  @IsEmail({}, { message: "El email debe ser un correo válido" })
  @MaxLength(150, { message: "El email no puede tener más de 150 caracteres" })
  email!: string;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: "El ID de la carrera es obligatorio" })
  @Type(() => Number)
  @IsInt({ message: "El ID de la carrera debe ser un número entero" })
  @IsPositive({ message: "El ID de la carrera debe ser positivo" })
  carreraId!: number;

  @ApiProperty({ example: "2024000042" })
  @Trim()
  @IsDefined({ message: "El código es obligatorio" })
  @IsString({ message: "El código debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El código no puede estar vacío" })
  @Length(10, 10, { message: "El código debe tener exactamente 10 caracteres" })
  @Matches(/^[A-Z0-9]{10}$/, {
    message: "El código solo puede contener letras mayúsculas y dígitos"
  })
  codigo!: string;

  @ApiProperty({ example: "2024-03-01" })
  @Trim()
  @IsDefined({ message: "La fecha de matrícula es obligatoria" })
  @IsString({ message: "La fecha de matrícula debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La fecha de matrícula no puede estar vacía" })
  @IsDateString(
    {},
    { message: "La fecha de matrícula debe tener formato YYYY-MM-DD" }
  )
  fechaMatricula!: string;

  @ApiPropertyOptional({ example: "juan@uni.edu.pe" })
  @TrimOptional()
  @IsOptional()
  @IsEmail({}, { message: "El email no tiene un formato válido" })
  @IsNotEmpty({ message: "El email institucional no puede estar vacío" })
  @MaxLength(150, { message: "El email no puede tener más de 150 caracteres" })
  emailInstitucional?: string;

  @ApiPropertyOptional({ example: "987654321" })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: "El teléfono debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El teléfono no puede estar vacío" })
  @Matches(/^[0-9]{9}$/, {
    message: "El teléfono debe contener exactamente 9 dígitos numéricos"
  })
  telefono?: string;

  @ApiPropertyOptional({ example: "2000-05-20" })
  @TrimOptional()
  @IsOptional()
  @IsString({ message: "La fecha de nacimiento debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La fecha de nacimiento no puede estar vacía" })
  @IsDateString(
    {},
    { message: "La fecha de nacimiento debe tener formato YYYY-MM-DD" }
  )
  fechaNacimiento?: string;
}
