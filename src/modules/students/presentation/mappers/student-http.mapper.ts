// modules/students/presentation/mappers/student-http.mapper.ts

import { PaginatedResultDto, type PaginationVO } from '@core/pagination';
import type { CreateStudentCommand } from '@students/application/commands';
import type { StudentView } from '@students/application/read-models';
import type { Student } from '@students/domain/entities';
import { StudentResponseDto } from '../dtos';

export class StudentHttpMapper {
  static toResponseFromCreate(student: Student, command: CreateStudentCommand): StudentResponseDto {
    const dto = new StudentResponseDto();

    dto.id = student.id!;
    dto.careerId = student.careerId;
    dto.code = student.code;
    dto.institutionalEmail = student.institutionalEmail;
    dto.enrollmentDate = student.enrollmentDate;
    dto.status = student.status;
    dto.dni = command.dni;
    dto.firstName = command.firstName;
    dto.lastName = command.lastName;
    dto.fullName = `${command.firstName} ${command.lastName}`.trim();
    dto.email = command.email;
    dto.phone = command.phone ?? null;
    dto.birthDate = command.birthDate ?? null;

    return dto;
  }

  static toResponse(student: StudentView): StudentResponseDto {
    const dto = new StudentResponseDto();

    dto.id = student.id!;
    dto.careerId = student.careerId;
    dto.code = student.code;
    dto.institutionalEmail = student.institutionalEmail;
    dto.enrollmentDate = student.enrollmentDate;
    dto.status = student.status;
    dto.dni = student.dni;
    dto.firstName = student.firstName;
    dto.lastName = student.lastName;
    dto.fullName = `${student.firstName} ${student.lastName}`.trim();
    dto.email = student.email;
    dto.phone = student.phone;
    dto.birthDate = student.birthDate;

    return dto;
  }

  static toPaginatedResponse(
    result: PaginatedResultDto<StudentView>,
    pagination: PaginationVO,
  ): PaginatedResultDto<StudentResponseDto> {
    return PaginatedResultDto.from(
      result.items.map(StudentHttpMapper.toResponse),
      result.total,
      pagination,
    );
  }
}
