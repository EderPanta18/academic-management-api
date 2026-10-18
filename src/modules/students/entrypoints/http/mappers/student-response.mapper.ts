import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import type { StudentReadModel } from '@students/application/read-models';
import type { Student } from '@students/domain/entities';
import { StudentReadModelResponseDto, StudentResponseDto } from '../dtos';

export class StudentResponseMapper {
  static toResponse(student: Student): StudentResponseDto {
    const dto = new StudentResponseDto();

    dto.id = student.id;
    dto.personId = student.personId;
    dto.academicProgramId = student.academicProgramId;
    dto.code = student.code;
    dto.institutionalEmail = student.institutionalEmail;
    dto.admissionPeriod = student.admissionPeriod;
    dto.status = student.status;

    return dto;
  }

  static toReadModelResponse(model: StudentReadModel): StudentReadModelResponseDto {
    const dto = new StudentReadModelResponseDto();

    dto.id = model.id;
    dto.personId = model.personId;
    dto.academicProgramId = model.academicProgramId;
    dto.code = model.code;
    dto.institutionalEmail = model.institutionalEmail;
    dto.admissionPeriod = model.admissionPeriod;
    dto.status = model.status;

    dto.documentTypeName = model.documentTypeName;
    dto.documentNumber = model.documentNumber;
    dto.firstName = model.firstName;
    dto.lastName = model.lastName;
    dto.email = model.email;
    dto.phone = model.phone;
    dto.birthDate = model.birthDate;

    return dto;
  }

  static toPaginatedResponse(
    items: StudentReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<StudentReadModelResponseDto> {
    const mappedItems = items.map(StudentResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }
}
