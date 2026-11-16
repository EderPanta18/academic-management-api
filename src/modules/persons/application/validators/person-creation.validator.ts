// src/modules/persons/application/validators/person-creation.validator.ts

import { Inject, Injectable } from '@nestjs/common';
import {
  PersonDocumentAlreadyExistsException,
  PersonDocumentTypeNotFoundException,
  PersonEmailAlreadyExistsException,
} from '../exceptions';
import {
  DOCUMENT_TYPE_REPOSITORY_TOKEN,
  type IDocumentTypeRepository,
  type IPersonRepository,
  PERSON_REPOSITORY_TOKEN,
} from '../ports/out';

type PersonCreationCriteria = {
  documentTypeId: string;
  documentNumber: string;
  email?: string | null;
};

@Injectable()
export class PersonCreationValidator {
  constructor(
    @Inject(PERSON_REPOSITORY_TOKEN)
    private readonly personRepository: IPersonRepository,

    @Inject(DOCUMENT_TYPE_REPOSITORY_TOKEN)
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async assertCanCreate(criteria: PersonCreationCriteria): Promise<void> {
    if (!(await this.documentTypeRepository.exists(criteria.documentTypeId)))
      throw new PersonDocumentTypeNotFoundException(criteria.documentTypeId);

    if (
      await this.personRepository.existsByDocument(criteria.documentTypeId, criteria.documentNumber)
    )
      throw new PersonDocumentAlreadyExistsException(
        criteria.documentTypeId,
        criteria.documentNumber,
      );

    if (criteria.email && (await this.personRepository.existsByEmail(criteria.email)))
      throw new PersonEmailAlreadyExistsException(criteria.email);
  }
}
