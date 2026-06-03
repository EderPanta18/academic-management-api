// modules/persons/persons.module.ts

import { Module } from '@nestjs/common';

import { PERSON_CREATION_VALIDATOR_PORT, PERSON_REPOSITORY_PORT } from './application/ports';
import { PersonCreationValidator } from './application/services';
import { PersonRepository } from './infrastructure/persistence';

@Module({
  providers: [
    PersonCreationValidator,
    {
      provide: PERSON_CREATION_VALIDATOR_PORT,
      useExisting: PersonCreationValidator,
    },
    PersonRepository,
    { provide: PERSON_REPOSITORY_PORT, useExisting: PersonRepository },
  ],
  exports: [PERSON_CREATION_VALIDATOR_PORT],
})
export class PersonsModule {}
