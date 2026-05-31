// modules/students/presentation/dtos/request/student-import-row.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Trim, TrimOptional } from '@shared/decorators';

export class StudentImportRowDto {
  @ApiProperty({ example: 'Juan Carlos' })
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'nombres no puede estar vacío' })
  @MaxLength(100)
  nombres: string;

  @ApiProperty({ example: 'Pérez García' })
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'apellidos no puede estar vacío' })
  @MaxLength(100)
  apellidos: string;

  @ApiProperty({ example: '87654321' })
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'dni no puede estar vacío' })
  @MaxLength(20)
  dni: string;

  @ApiProperty({ example: 'juan@gmail.com' })
  @Trim()
  @IsEmail({}, { message: 'email debe ser un correo válido' })
  email: string;

  @ApiProperty({ example: '2024000042' })
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'codigo no puede estar vacío' })
  @MaxLength(30)
  codigo: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt({ message: 'careerId debe ser un número entero' })
  @IsPositive({ message: 'careerId debe ser positivo' })
  careerId: number;

  @ApiProperty({ example: '2024-03-01' })
  @Trim()
  @IsDateString({}, { message: 'fechaMatricula debe tener formato YYYY-MM-DD' })
  fechaMatricula: string;

  @ApiPropertyOptional({ example: 'juan@uni.edu.pe' })
  @TrimOptional()
  @IsOptional()
  @IsEmail({}, { message: 'emailInstitucional debe ser un correo válido' })
  emailInstitucional?: string;

  @ApiPropertyOptional({ example: '987654321' })
  @TrimOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ example: '2000-05-20' })
  @TrimOptional()
  @IsOptional()
  @IsDateString(
    {},
    { message: 'fechaNacimiento debe tener formato YYYY-MM-DD' },
  )
  fechaNacimiento?: string;
}
