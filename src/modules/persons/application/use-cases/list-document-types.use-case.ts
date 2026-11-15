import { AUTHORIZER_TOKEN, type IAuthorizer } from '@authorization';
import { Inject, Injectable } from '@nestjs/common';
import { DOCUMENT_TYPE_QUERY_TOKEN, type IDocumentTypeQuery } from '../ports/out';
import type { DocumentTypeReadModel } from '../read-models';

@Injectable()
export class ListDocumentTypesUseCase {
  constructor(
    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(DOCUMENT_TYPE_QUERY_TOKEN)
    private readonly documentTypeQuery: IDocumentTypeQuery,
  ) {}

  async execute(actorUserId: string): Promise<DocumentTypeReadModel[]> {
    await this.authorizer.assertAuthorized(actorUserId, ['document-types.read']);

    return this.documentTypeQuery.findAll();
  }
}
