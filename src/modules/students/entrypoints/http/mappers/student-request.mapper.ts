import type { CreateStudentCommand } from '@students/application/commands';
import type { ListStudentsQuery } from '@students/application/queries';
import type { CreateStudentRequestDto, ListStudentsQueryDto } from '../dtos';

export class StudentRequestMapper {
  static toListQuery(dto: ListStudentsQueryDto): ListStudentsQuery {
    return {
      academicProgramId: dto.academicProgramId,
      status: dto.status,
      search: dto.search,
    };
  }

  static toCreateCommand(dto: CreateStudentRequestDto): CreateStudentCommand {
    return {
      documentTypeId: dto.documentTypeId,
      documentNumber: dto.documentNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      birthDate: dto.birthDate ?? null,
      academicProgramId: dto.academicProgramId,
      code: dto.code,
      institutionalEmail: dto.institutionalEmail ?? null,
      admissionPeriod: dto.admissionPeriod ?? null,
      status: dto.status ?? null,
    };
  }
}
