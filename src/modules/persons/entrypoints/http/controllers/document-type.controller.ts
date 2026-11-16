// src/modules/persons/entrypoints/http/controllers/document-type.controller.ts

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListDocumentTypesUseCase } from '@persons/application/use-cases';
import type { SwaggerTag } from '@platform/http';
import { CurrentUserId } from '@shared/decorators';
import { ApiListDocumentTypes } from '../decorators';
import { DocumentTypeReadModelResponseDto } from '../dtos';
import { DocumentTypeResponseMapper } from '../mappers';

const DOCUMENT_TYPE_ROUTES = {
  ROOT: 'document-types',
} as const;

export const DOCUMENT_TYPE_SWAGGER_TAG = {
  name: 'document-types',
  description: 'Endpoints relacionados con la consulta del catálogo de tipos de documento.',
} as const satisfies SwaggerTag;

@ApiTags(DOCUMENT_TYPE_SWAGGER_TAG.name)
@Controller(DOCUMENT_TYPE_ROUTES.ROOT)
export class DocumentTypeController {
  constructor(private readonly listDocumentTypesUseCase: ListDocumentTypesUseCase) {}

  @Get()
  @ApiListDocumentTypes()
  async list(@CurrentUserId() actorUserId: string): Promise<DocumentTypeReadModelResponseDto[]> {
    const items = await this.listDocumentTypesUseCase.execute(actorUserId);

    return DocumentTypeResponseMapper.toListResponse(items);
  }
}
