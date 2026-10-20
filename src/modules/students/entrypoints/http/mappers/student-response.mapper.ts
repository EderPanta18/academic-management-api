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

  static toReadModelResponse(readModel: StudentReadModel): StudentReadModelResponseDto {
    const dto = new StudentReadModelResponseDto();

    dto.id = readModel.id;
    dto.personId = readModel.personId;
    dto.academicProgramId = readModel.academicProgramId;
    dto.code = readModel.code;
    dto.institutionalEmail = readModel.institutionalEmail;
    dto.admissionPeriod = readModel.admissionPeriod;
    dto.status = readModel.status;

    dto.documentTypeName = readModel.documentTypeName;
    dto.documentNumber = readModel.documentNumber;
    dto.firstName = readModel.firstName;
    dto.lastName = readModel.lastName;
    dto.email = readModel.email;
    dto.phone = readModel.phone;
    dto.birthDate = readModel.birthDate;

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
