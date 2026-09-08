import {
  DOCUMENT_TYPE_REPOSITORY_TOKEN,
  PERSON_CREATION_VALIDATOR_TOKEN,
  PERSON_REPOSITORY_TOKEN,
} from '@identity/application/ports';
import { PersonCreationValidator } from '@identity/application/services';
import { DocumentTypeRepository, PersonRepository } from '@identity/infrastructure/persistence';
import { Module } from '@nestjs/common';

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
  ],
  exports: [PERSON_CREATION_VALIDATOR_TOKEN],
})
export class IdentityModule {}
