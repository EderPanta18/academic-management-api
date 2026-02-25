// modules/professors/presentation/dtos/request/create-professor.dto.ts

import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfessorStatus } from '@professors/domain/constants';

export class CreateProfessorDto {
  @ApiProperty({
    description: 'DNI del profesor — 8 dígitos numéricos',
    example: '12345678',
  })
  @IsString()
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'El DNI debe contener solo dígitos' })
  dni: string;

  @ApiProperty({ description: 'Nombre del profesor', example: 'Juan Carlos' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Apellido del profesor', example: 'Pérez López' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Email del profesor',
    example: 'juan.perez@universidad.edu.pe',
  })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({
    description: 'ID del departamento del profesor',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  departmentId?: number;

  @ApiPropertyOptional({
    description: 'Especialidad del profesor',
    example: 'Bases de Datos',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @ApiPropertyOptional({
    description: 'Fecha de contratación del profesor',
    example: '2024-03-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hireDate?: Date;

  @ApiPropertyOptional({
    description: 'Número de teléfono del profesor',
    example: '987654321',
  })
  @IsOptional()
  @IsString()
  @MaxLength(12)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del profesor',
    example: '1985-06-15',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthDate?: Date;

  @ApiPropertyOptional({
    description: 'Estado del profesor',
    enum: ProfessorStatus,
    default: ProfessorStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProfessorStatus)
  status?: ProfessorStatus;
}
