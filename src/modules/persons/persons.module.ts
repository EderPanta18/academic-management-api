// modules/persons/persons.module.ts

import { Module } from '@nestjs/common';
import {
  PERSON_REPOSITORY_PORT,
  CREATE_PERSON_USE_CASE_PORT,
} from './domain/ports';
import { CreatePersonUseCase } from './application/use-cases';
import { PersonRepository } from './infrastructure/persistence';

@Module({
  providers: [
    CreatePersonUseCase,
    { provide: CREATE_PERSON_USE_CASE_PORT, useExisting: CreatePersonUseCase },
    PersonRepository,
    { provide: PERSON_REPOSITORY_PORT, useExisting: PersonRepository },
  ],
  exports: [CREATE_PERSON_USE_CASE_PORT],
})
export class PersonsModule {}
