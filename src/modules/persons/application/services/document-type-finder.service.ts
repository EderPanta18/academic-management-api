import { Inject, Injectable } from '@nestjs/common';
import {
  DOCUMENT_TYPE_REPOSITORY_TOKEN,
  type IDocumentTypeFinder,
  type IDocumentTypeRepository,
} from '../ports';

@Injectable()
export class DocumentTypeFinderService implements IDocumentTypeFinder {
  constructor(
    @Inject(DOCUMENT_TYPE_REPOSITORY_TOKEN)
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async findIdByCode(code: string): Promise<string | null> {
    const documentType = await this.documentTypeRepository.findByCode(code);

    return documentType?.id ?? null;
  }
}
