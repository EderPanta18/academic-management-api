import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import type { StudentImportReadModel } from '@students/application/read-models';
import { StudentImportReadModelResponseDto } from '../dtos';

export class StudentImportResponseMapper {
  static toResponse(model: StudentImportReadModel): StudentImportReadModelResponseDto {
    const dto = new StudentImportReadModelResponseDto();

    dto.id = model.id;
    dto.fileName = model.fileName;
    dto.fileExtension = model.fileExtension;
    dto.fileSize = model.fileSize;
    dto.fileMimeType = model.fileMimeType;
    dto.status = model.status;

    dto.totalRows = model.totalRows;
    dto.processedRows = model.processedRows;
    dto.acceptedRows = model.acceptedRows;
    dto.rejectedRows = model.rejectedRows;
    dto.duplicatedRows = model.duplicatedRows;
    dto.observedRows = model.observedRows;

    dto.errors = model.errors
      ? model.errors.map((err) => ({
          row: err.row,
          reasons: err.reasons,
        }))
      : null;
    dto.failureReason = model.failureReason;

    dto.createdByUserId = model.createdByUserId;
    dto.startedAt = model.startedAt;
    dto.finishedAt = model.finishedAt;

    return dto;
  }

  static toPaginatedResponse(
    items: StudentImportReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<StudentImportReadModelResponseDto> {
    const mappedItems = items.map(StudentImportResponseMapper.toResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }
}
