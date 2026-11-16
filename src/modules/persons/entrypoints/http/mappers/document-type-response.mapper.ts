// src/modules/persons/entrypoints/http/mappers/document-type-response.mapper.ts

import type { DocumentTypeReadModel } from '@persons/application/read-models';
import { DocumentTypeReadModelResponseDto } from '../dtos';

export class DocumentTypeResponseMapper {
  static toListResponse(items: DocumentTypeReadModel[]): DocumentTypeReadModelResponseDto[] {
    return items.map(DocumentTypeResponseMapper.toReadModelResponse);
  }

  private static toReadModelResponse(
    readModel: DocumentTypeReadModel,
  ): DocumentTypeReadModelResponseDto {
    const dto = new DocumentTypeReadModelResponseDto();

    dto.id = readModel.id;
    dto.code = readModel.code;
    dto.name = readModel.name;
    dto.description = readModel.description;

    return dto;
  }
}
