import { Module } from '@nestjs/common';
import {
  DOCUMENT_TYPE_FINDER_TOKEN,
  DOCUMENT_TYPE_REPOSITORY_TOKEN,
  PERSON_CREATION_VALIDATOR_TOKEN,
  PERSON_REPOSITORY_TOKEN,
} from './application/ports';
import { DocumentTypeFinder, PersonCreationValidator } from './application/services';
import { DocumentTypeRepository, PersonRepository } from './infrastructure/persistence';

@Module({
  providers: [
    {
      provide: DOCUMENT_TYPE_REPOSITORY_TOKEN,
      useClass: DocumentTypeRepository,
    },
    {
      provide: PERSON_REPOSITORY_TOKEN,
      useClass: PersonRepository,
    },
    {
      provide: PERSON_CREATION_VALIDATOR_TOKEN,
      useClass: PersonCreationValidator,
    },
    {
      provide: DOCUMENT_TYPE_FINDER_TOKEN,
      useClass: DocumentTypeFinder,
    },
  ],
  exports: [PERSON_CREATION_VALIDATOR_TOKEN, DOCUMENT_TYPE_FINDER_TOKEN],
})
export class IdentityModule {}
