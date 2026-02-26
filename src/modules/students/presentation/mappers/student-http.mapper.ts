// modules/students/presentation/mappers/student-http.mapper.ts

import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { Student } from '@students/domain/entities';
import { StudentResponseDto } from '../dtos';

export class StudentHttpMapper {
  static toResponse(student: Student): StudentResponseDto {
    const dto = new StudentResponseDto();
    dto.id = student.id!;
    dto.dni = student.dni;
    dto.firstName = student.firstName;
    dto.lastName = student.lastName;
    dto.fullName = student.fullName;
    dto.email = student.email;
    dto.phone = student.phone;
    dto.birthDate = student.birthDate;
    dto.careerId = student.careerId;
    dto.code = student.code;
    dto.institutionalEmail = student.institutionalEmail!;
    dto.enrollmentDate = student.enrollmentDate;
    dto.status = student.status;
    return dto;
  }

  static toPaginatedResponse(
    result: PaginatedResultDto<Student>,
    pagination: PaginationVO,
  ): PaginatedResultDto<StudentResponseDto> {
    return PaginatedResultDto.from(
      result.items.map(StudentHttpMapper.toResponse),
      result.total,
      pagination,
    );
  }
}
