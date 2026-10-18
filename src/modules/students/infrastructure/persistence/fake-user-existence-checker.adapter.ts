import { Injectable, Logger } from '@nestjs/common';
import type { IUserExistenceChecker } from '@students/application/ports/out';

@Injectable()
export class FakeUserExistenceChecker implements IUserExistenceChecker {
  private readonly logger = new Logger(FakeUserExistenceChecker.name);

  async exists(id: string): Promise<boolean> {
    this.logger.warn(
      `[FAKE CHECKER] Verificando usuario ${id}. El módulo 'users' no está implementado, se asume que existe.`,
    );

    // Retornamos true siempre para permitir probar el flujo de importación
    return true;
  }
}
