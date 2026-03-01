// modules/departments/departments.module.ts

import { Module } from '@nestjs/common';
import { DEPARTMENT_FINDER_PORT } from '@departments/domain/ports';
import { DepartmentPrismaRepository } from '@departments/infrastructure/persistence';

@Module({
  providers: [
    DepartmentPrismaRepository,
    {
      provide: DEPARTMENT_FINDER_PORT,
      useExisting: DepartmentPrismaRepository,
    },
  ],
  exports: [DEPARTMENT_FINDER_PORT],
})
export class DepartmentsModule {}
