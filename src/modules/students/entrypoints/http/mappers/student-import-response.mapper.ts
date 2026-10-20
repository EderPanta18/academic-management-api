import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import type { StudentImportReadModel } from '@students/application/read-models';
import { StudentImportReadModelResponseDto } from '../dtos';

export class StudentImportResponseMapper {
  static toReadModelResponse(readModel: StudentImportReadModel): StudentImportReadModelResponseDto {
    const dto = new StudentImportReadModelResponseDto();

    dto.id = readModel.id;
    dto.fileName = readModel.fileName;
    dto.fileExtension = readModel.fileExtension;
    dto.fileSize = readModel.fileSize;
    dto.fileMimeType = readModel.fileMimeType;
    dto.status = readModel.status;

    dto.totalRows = readModel.totalRows;
    dto.processedRows = readModel.processedRows;
    dto.acceptedRows = readModel.acceptedRows;
    dto.rejectedRows = readModel.rejectedRows;
    dto.duplicatedRows = readModel.duplicatedRows;
    dto.observedRows = readModel.observedRows;

    dto.errors = readModel.errors
      ? readModel.errors.map((err) => ({
          row: err.row,
          reasons: err.reasons,
        }))
      : null;
    dto.failureReason = readModel.failureReason;

    dto.createdByUserId = readModel.createdByUserId;
    dto.startedAt = readModel.startedAt;
    dto.finishedAt = readModel.finishedAt;

    return dto;
  }

  static toPaginatedResponse(
    items: StudentImportReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<StudentImportReadModelResponseDto> {
    const mappedItems = items.map(StudentImportResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }
}
