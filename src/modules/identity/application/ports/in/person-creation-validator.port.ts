// modules/persons/application/ports/in/person-creation-validator.port.ts

import type { PersonUniquenessCheckInput } from '@identity/application/contracts';

export const PERSON_CREATION_VALIDATOR_TOKEN = Symbol('PERSON_CREATION_VALIDATOR');

export interface IPersonCreationValidator {
  validate(input: PersonUniquenessCheckInput): Promise<void>;
}
