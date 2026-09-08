import {
  PersonDocumentAlreadyExistsException,
  PersonDocumentTypeNotFoundException,
  PersonEmailAlreadyExistsException,
  PersonPhoneAlreadyExistsException,
} from '@identity/application/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import type { PersonUniquenessCheckInput } from '../contracts';
import {
  DOCUMENT_TYPE_REPOSITORY_TOKEN,
  type IDocumentTypeRepository,
  type IPersonCreationValidator,
  type IPersonRepository,
  PERSON_REPOSITORY_TOKEN,
} from '../ports';

@Injectable()
export class PersonCreationValidator implements IPersonCreationValidator {
  constructor(
    @Inject(DOCUMENT_TYPE_REPOSITORY_TOKEN)
    private readonly documentTypeRepository: IDocumentTypeRepository,

    @Inject(PERSON_REPOSITORY_TOKEN)
    private readonly personRepository: IPersonRepository,
  ) {}

  async validate(input: PersonUniquenessCheckInput): Promise<void> {
    const documentTypeExists = await this.documentTypeRepository.existsById(input.documentTypeId);

    if (!documentTypeExists) throw new PersonDocumentTypeNotFoundException(input.documentTypeId);

    const documentAlreadyExists = await this.personRepository.existsByDocumentTypeIdAndNumber(
      input.documentTypeId,
      input.documentNumber,
    );

    if (documentAlreadyExists)
      throw new PersonDocumentAlreadyExistsException(input.documentTypeId, input.documentNumber);

    const emailAlreadyExists = await this.personRepository.existsByEmail(input.email);

    if (emailAlreadyExists) throw new PersonEmailAlreadyExistsException(input.email);

    if (input.phone) {
      const phoneAlreadyExists = await this.personRepository.existsByPhone(input.phone);

      if (phoneAlreadyExists) throw new PersonPhoneAlreadyExistsException(input.phone);
    }
  }
}
