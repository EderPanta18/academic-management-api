// src/modules/persons/persons.module.ts

import { AuthorizationModule } from '@authorization';
import { Module } from '@nestjs/common';
import {
  DOCUMENT_TYPE_FINDER_TOKEN,
  DOCUMENT_TYPE_QUERY_TOKEN,
  DOCUMENT_TYPE_REPOSITORY_TOKEN,
  PERSON_CHECKER_TOKEN,
  PERSON_CREATOR_TOKEN,
  PERSON_QUERY_TOKEN,
  PERSON_REPOSITORY_TOKEN,
} from '@persons/application/ports';
import {
  DocumentTypeFinderService,
  PersonCheckerService,
  PersonCreatorService,
} from '@persons/application/services';
import {
  CreatePersonUseCase,
  GetPersonUseCase,
  ListDocumentTypesUseCase,
  ListPersonsUseCase,
  UpdatePersonUseCase,
} from '@persons/application/use-cases';
import { PersonCreationValidator } from '@persons/application/validators';
import {
  DocumentTypeQueryAdapter,
  DocumentTypeRepositoryAdapter,
  PersonQueryAdapter,
  PersonRepositoryAdapter,
} from '@persons/infrastructure/persistence';
import { DatabaseModule } from '@platform/database';
import { IdGeneratorModule } from '@platform/id-generator';
import { DocumentTypeController, PersonController } from './entrypoints/http';

@Module({
  imports: [DatabaseModule, IdGeneratorModule, AuthorizationModule],

  controllers: [PersonController, DocumentTypeController],

  providers: [
    // Casos de uso
    CreatePersonUseCase,
    UpdatePersonUseCase,
    GetPersonUseCase,
    ListPersonsUseCase,
    ListDocumentTypesUseCase,

    // Validadores
    PersonCreationValidator,

    // Puertos de aplicación
    {
      provide: PERSON_CREATOR_TOKEN,
      useExisting: PersonCreatorService,
    },
    {
      provide: PERSON_CHECKER_TOKEN,
      useExisting: PersonCheckerService,
    },
    {
      provide: DOCUMENT_TYPE_FINDER_TOKEN,
      useExisting: DocumentTypeFinderService,
    },

    // Repositorios
    {
      provide: PERSON_REPOSITORY_TOKEN,
      useClass: PersonRepositoryAdapter,
    },
    {
      provide: DOCUMENT_TYPE_REPOSITORY_TOKEN,
      useClass: DocumentTypeRepositoryAdapter,
    },

    // Consultas
    {
      provide: PERSON_QUERY_TOKEN,
      useClass: PersonQueryAdapter,
    },
    {
      provide: DOCUMENT_TYPE_QUERY_TOKEN,
      useClass: DocumentTypeQueryAdapter,
    },
  ],
  exports: [PERSON_CREATOR_TOKEN, PERSON_CHECKER_TOKEN, DOCUMENT_TYPE_FINDER_TOKEN],
})
export class PersonsModule {}
