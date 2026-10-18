import { Injectable, Logger } from '@nestjs/common';
import type { ProcessStudentImportCommand } from '@students/application/commands';
import { ProcessStudentImportUseCase } from '@students/application/use-cases';

@Injectable()
export class StudentImportProcessor {
  private readonly logger = new Logger(StudentImportProcessor.name);

  constructor(private readonly processStudentImportUseCase: ProcessStudentImportUseCase) {}

  async handle(payload: { importId: string }): Promise<void> {
    this.logger.log(`Iniciando procesamiento de importación asíncrona: ${payload.importId}`);

    const command: ProcessStudentImportCommand = {
      importId: payload.importId,
    };

    try {
      // Ejecutamos la lógica pesada
      await this.processStudentImportUseCase.execute(command);

      this.logger.log(`Importación ${payload.importId} finalizada correctamente.`);
    } catch (error) {
      // El Caso de Uso ya se encargó de marcar la importación como FAILED en la BD.
      // Aquí solo logueamos para tener evidencia técnica y relanzamos el error
      // para que la cola (PgBoss) detecte el fallo y aplique los reintentos.

      this.logger.error(
        `Error crítico en el procesador de importación ${payload.importId}`,
        error instanceof Error ? error.stack : error,
      );

      throw error;
    }
  }
}
