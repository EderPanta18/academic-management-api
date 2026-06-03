// modules/departments/departments.module.ts

import { Module } from '@nestjs/common';

import { DEPARTMENT_FINDER_PORT } from './application/ports';
import { DepartmentRepository } from './infrastructure/persistence';

@Module({
  providers: [
    DepartmentRepository,
    {
      provide: DEPARTMENT_FINDER_PORT,
      useExisting: DepartmentRepository,
    },
  ],
  exports: [DEPARTMENT_FINDER_PORT],
})
export class DepartmentsModule {}
