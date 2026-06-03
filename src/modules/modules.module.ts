//modules/modules.module.ts

import { Module } from '@nestjs/common';
import { AcademicPeriodsModule } from './academic-periods';
import { CareersModule } from './careers';
import { CourseCategoriesModule } from './course-categories';
import { CourseOfferingsModule } from './course-offerings';
import { CoursesModule } from './courses';
import { DepartmentsModule } from './departments';
import { EnrollmentsModule } from './enrollments';
import { PersonsModule } from './persons';
import { ProfessorsModule } from './professors';
import { StudentsModule } from './students';

@Module({
  imports: [
    PersonsModule,
    DepartmentsModule,
    CareersModule,
    AcademicPeriodsModule,
    CourseCategoriesModule,
    CoursesModule,
    ProfessorsModule,
    StudentsModule,
    CourseOfferingsModule,
    EnrollmentsModule,
  ],
})
export class ModulesModule {}
