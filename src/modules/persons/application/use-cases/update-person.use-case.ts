import { AUTHORIZER_TOKEN, type IAuthorizer } from '@authorization';
import {
  AUDIT_WRITER_TOKEN,
  type IAuditWriter,
  type ITransactionManager,
  TRANSACTION_MANAGER_TOKEN,
} from '@core/contracts';
import { Inject, Injectable } from '@nestjs/common';
import type { Person } from '@persons/domain/entities';
import type { UpdatePersonCommand } from '../commands';
import { PersonEmailAlreadyExistsException, PersonNotFoundException } from '../exceptions';
import { type IPersonRepository, PERSON_REPOSITORY_TOKEN } from '../ports/out';

@Injectable()
export class UpdatePersonUseCase {
  constructor(
    @Inject(TRANSACTION_MANAGER_TOKEN)
    private readonly transactionManager: ITransactionManager,

    @Inject(AUDIT_WRITER_TOKEN)
    private readonly auditWriter: IAuditWriter,

    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(PERSON_REPOSITORY_TOKEN)
    private readonly personRepository: IPersonRepository,
  ) {}

  async execute(
    actorUserId: string,
    personId: string,
    command: UpdatePersonCommand,
  ): Promise<Person> {
    return this.transactionManager.run(
      async () => {
        await this.authorizer.assertAuthorized(actorUserId, ['persons.update']);

        const person = await this.personRepository.find(personId);

        if (!person) throw new PersonNotFoundException(personId);

        if (
          command.email &&
          command.email.toLowerCase() !== person.email?.toLowerCase() &&
          (await this.personRepository.existsByEmail(command.email))
        )
          throw new PersonEmailAlreadyExistsException(command.email);

        const updatedPerson = person.update(command);

        await this.personRepository.update(updatedPerson);

        await this.auditWriter.append({
          actorUserId,
          action: 'persons.person.update',
          module: 'persons',
          resourceType: 'Person',
          resourceId: personId,
          outcome: 'CONFIRMED',
        });

        return updatedPerson;
      },
      { isolation: 'SERIALIZABLE', retries: 2 },
    );
  }
}
